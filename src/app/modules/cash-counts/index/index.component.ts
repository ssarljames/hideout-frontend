import { LaundryService } from 'app/services/laundry';
import { StateService } from './../../../core/state.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CashCountService } from 'app/services/cash_count';
import { fetchAnimation } from 'app/animations/animations';
import { AuthenticationService } from 'app/core/auth.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { EchoService } from 'angular-laravel-echo';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations:[ fetchAnimation ]
})
export class CashCountIndexComponent implements OnInit, OnDestroy {


  _from_date: Date;
  _to_date: Date;

  queryParams = {
    q: '',
    per_page : 25,
    page: 1,
    type: 'all',
    from_date: null,
    to_date: null,
    sort_active: 'created_at',
    sort_direction: 'desc'
  };

  meta: any = {};

  cash_counts: any[] = [];

  selected_cash_count: any = {};

  isFetching = false;


  today: string = moment().format('YYYY-MM-DD');

  types: any[] = [{value: 'all', name: 'All'}];

  summary: any = null;

  currentUser: any = {};

  constructor(private cashCountService: CashCountService,
              private authenticationService: AuthenticationService,
              private laundryService: LaundryService,
              private stateService: StateService,
              private modalService: NgbModal,
              private echoService: EchoService,
              private toastr: ToastrService) {

      this.currentUser = this.authenticationService.getCurrentUser();

      this._from_date = moment().endOf('day').toDate();
      this._to_date = moment().endOf('day').toDate();
  }

  ngOnInit() {

      const cashCountState = this.stateService.get('cashCount');
      if (cashCountState) {
        this.queryParams = cashCountState.queryParams;
        this.cash_counts = cashCountState.cash_counts;
        this.meta = cashCountState.meta;
        this.summary = cashCountState.summary;
      }

      this.stateService.set('cashCount', null);

      this.cashCountService.getTypes().subscribe(
        data => {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const element = data[key];
              this.types.push({name: element, value: key})
            }
          }
          this.fetchCashCounts();

        }
      );

      this.connectEcho();

  }

  ngOnDestroy() {
    // this.echoService.leave('cash-counts');
    this.stateService.set('cashCount', {
      queryParams: this.queryParams,
      cash_counts: this.cash_counts,
      meta: this.meta,
      summary: this.summary
    });
  }

  connectEcho() {
    this.echoService.join('cash-counts', 'private');
    console.log('connected to cash-counts from cash count page');
    this.echoService.listen('cash-counts', 'CashCountCreated').subscribe(
      data => {
        this.fetchCashCounts();
      }
    );
    this.echoService.listen('cash-counts', 'CashCountUpdated').subscribe(
      data => {
        this.fetchCashCounts();
      }
    );
    this.echoService.listen('cash-counts', 'CashCountDeleted').subscribe(
      data => {
        this.fetchCashCounts();
      }
    );
  }


  fetchCashCounts(event: KeyboardEvent = null) {

      if (this.isFetching || (event && event.key !== 'Enter')) {
        return;
      }

      if (this._from_date) {
        this.queryParams.from_date = moment(this._from_date).format('YYYY-MM-DD');
      }
      if (this._to_date) {
        this.queryParams.to_date = moment(this._to_date).format('YYYY-MM-DD');
      }

      this.isFetching = false;//true;

      this.cashCountService.query({
        params: this.queryParams
      }).subscribe(
        data => {
          this.meta = this.cashCountService.getMeta();
          this.cash_counts = data;

          this.fetchSummary();
        },
        error => {
          this.isFetching = false;
        }
      );
  }

  fetchSummary(): void{
    const queryParamsCopy: any = JSON.parse(JSON.stringify(this.queryParams));
    queryParamsCopy.summary = true;

    this.cashCountService.query({
      params: queryParamsCopy,
    }).subscribe(
      data => {
        this.summary = this.cashCountService.getMeta();
        this.isFetching = false;
      },
      error => {
        this.isFetching = false;
      }
    );
  }


  openLg(content: NgbModalRef, cash_count: any) {
    this.selected_cash_count = cash_count;
    console.log(this.selected_cash_count);

    if (content) {
      this.modalService.open(content, {windowClass: 'modal-holder', size: 'sm'});
    }

    if(!cash_count.is_remit){
      return;
    }

    this.cashCountService.queryRaw({
      params: {
        balance_date: moment(cash_count.created_at).format("YYYY-MM-DD"),
        user_id: cash_count.user_id
      }
    }).subscribe(
      data => {

            // console.log(data);


            if(cash_count.is_from_laundry){
                  this.laundryService.queryRaw({
                    params: {
                      sales_report: 1,
                      user_id: cash_count.user_id,
                      from_date: moment().format("YYYY-MM-DD"),
                      to_date: moment().format("YYYY-MM-DD"),
                    }
                  }).subscribe(
                    d2 => {
                        const sales = Number(d2.sales) + data.collectible;
                        this.selected_cash_count.has_deficit = sales > this.selected_cash_count.total;
                        this.selected_cash_count.sobra = (this.selected_cash_count.total - sales) > 0;

                    }
                )
            }
            else {

              this.selected_cash_count.has_deficit = data.collectible > this.selected_cash_count.total;
              this.selected_cash_count.sobra = (this.selected_cash_count.total - data.collectible) > 0;

            }
        }

    );


  }


  deleteCashCount(cash_count: any){
    if (!confirm('Are you sure to delete this entry?') ){
      return;
    }
    const num = Math.round(Math.random() * 10) + 2;
    const num2 = Math.round(Math.random() * 10) + 2;
    const ans = prompt(`Please answer the question if you're sure.\n\n${num} x ${num2} = ?`);
    if (Number(ans) !== (num * num2)) {
      return;
    }
    this.modalService.dismissAll();
    this.cashCountService.delete(cash_count.id).subscribe(
      data => {
        this.fetchCashCounts();
      }
    );
  }

  pageChange(event){
    this.queryParams.page = event.pageIndex + 1;
    this.queryParams.per_page = event.pageSize;
    this.fetchCashCounts()
  }

  sortData($event){
    this.queryParams.sort_active = $event.active;
    this.queryParams.sort_direction = $event.direction;
    this.queryParams.page = 1;
    this.fetchCashCounts();
  }


  confirmRemit() {
    if (!confirm('Are you sure?')) {
      return;
    }

    const cc: any = JSON.parse(JSON.stringify(this.selected_cash_count));
    cc.confirm = true;
    this.cashCountService.update(cc).subscribe(
      data => {
        this.fetchCashCounts();

        if ( data.group_remittance ) {
          this.selected_cash_count = data.group_remittance;
          this.selected_cash_count.cash_counts_included.forEach(e => {
            if (e.cash_count_id === cc.id) {
              e.highlight = true;
            } else {
              e.highlight = false;
            }
          });

          console.log(this.selected_cash_count);

        } else {
          this.modalService.dismissAll();
        }

        this.toastr.success('Cash Remit approved!');
      }
    );

  }

  isDeduction(cash_count: any) {
    const type = Number(cash_count.type);
    return type !== 1 &&
           type !== 4 &&
           type !== 9;
  }

  updateTotal(selected_cash_count) {
    const change_amount = prompt('Enter change:');
    if (/^\+?(0|[1-9]\d*)$/.test(change_amount)) {


      const total = (selected_cash_count.d1000 * 1000) +
                  (selected_cash_count.d500 * 500) +
                  (selected_cash_count.d200 * 200) +
                  (selected_cash_count.d100 * 100) +
                  (selected_cash_count.d50 * 50) +
                  (selected_cash_count.d20 * 20) +
                  (selected_cash_count.d10 * 10) +
                  (selected_cash_count.d5 * 5) +
                  (selected_cash_count.d1) +
                  (selected_cash_count.d25c * 0.25);

      if (Number(change_amount) >= total) {
        this.toastr.error('Change must be less than total amount');
        return;
      }

      selected_cash_count.change_amount = change_amount;
      this.cashCountService.update(selected_cash_count).subscribe(
        data => {
          this.fetchCashCounts();
          this.modalService.dismissAll();
        }
      );
    } else {
      this.toastr.error('Invalid integer input!');
    }
  }
}
