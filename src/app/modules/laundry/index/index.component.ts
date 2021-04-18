import { AddActionModalService } from './../add-action-modal/add-action-modal.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user';
import { StateService } from './../../../core/state.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModalRef, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from './../../../core/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LaundryService } from 'app/services/laundry';
import { fetchAnimation } from 'app/animations/animations';
import { EchoService } from 'angular-laravel-echo';
import * as moment from 'moment';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CustomerService } from 'app/services/customer';
import { AddPaymentService } from '../add-payment-modal/add-payment.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [fetchAnimation]
})
export class LaundryIndexComponent implements OnInit, OnDestroy {
  laundry_users:any[] = [];
  today: Date;
  sales_report: any = {};

  date_filters = [
    {
      value: '_today',
      label: 'Today'
    },
    {
      value: '_yesterday',
      label: 'Yesterday'
    },
    {
      value: '_custom',
      label: 'Custom'
    },
  ];

  customer: any = {};
  cash_received: number;
  actions: any[] = [];
  payment_methods: any[] = [];
  washing_machines: any[] = [];
  dryers: any[] = [];

  paymentModalRef: NgbModalRef;

  new_action: any = {
    description: null,
    machine_id: null,
    remarks: null
  };

  currentUser: any = {};
  _from_date: Date;
  _to_date: Date;

  _check_all = false;
  _checkboxes: any = {};

  status: any[] = [];

  filter_status = [
    {
      value: '_due',
      label: 'Due'
    },
    {
      value: '_for_pickup',
      label: 'For Pickup'
    },
    {
      value: '_for_delivery',
      label: 'For Delivery'
    },
    {
      value: '_overdue',
      label: 'Overdue'
    },
    {
      value: '_done',
      label: 'Done'
    },
    {
      value: '_undone',
      label: 'Undone'
    },
    {
      value: '_payments',
      label: 'Payments'
    },
    {
      value: '_for_refund',
      label: 'For Refund'
    }
  ];

  filter_date: any[] = [];

  queryParams = {
    q: '',
    per_page : 25,
    page: 1,
    type: 'all',
    from_date: null,
    to_date: null,
    sort_active: 'created_at',
    sort_direction: 'desc',
    filter_status: null,
    filter_date: null,
    unclaimed_only: true,
    transaction_type: null,
    payment_status: null
  };

  payment_status = [
    {
      value: 'paid',
      label: 'Paid'
    },
    {
      value: 'unpaid',
      label: 'Unpaid'
    }
  ]

  selectedLaundry: any = {};

  meta: any = {};

  laundries: any[] = [];
  isFetching = false;

  summary: any = {
    overdue: 0,
    due: 0,
    for_pickup: 0,
    for_delivery: 0
  };

  blink = true;

  pollFn: any;

  summaryChecked = {
    total_weight: 0,
    total_amount: 0,
    items: 0
  };

  transaction_types = [
    {
      value: 1,
      label: 'Walk-In'
    },
    {
      value: 2,
      label: 'Pickup'
    }
  ];

  saving = false;

  selectedImage: any = {};
  pollSummary: any;
  fetchingSummary = false;

  constructor(private laundryService: LaundryService,
              authenticationService: AuthenticationService,
              private userService: UserService,
              private customerService: CustomerService,
              private echoService: EchoService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private http: HttpClient,
              private stateService: StateService,
              private addActionService: AddActionModalService,
              private paymentService: AddPaymentService) {

                this.currentUser = authenticationService.getCurrentUser();
    // this._from_date = moment().toDate();
    // this._to_date = moment().toDate();
                this.sales_report = {
                  from_date: moment().toDate(),
                  to_date: moment().toDate(),
                  date_filter: '_today',
                  user_id: null
                }

                this.today = moment().toDate();

   }



  poll() {
    // this.pollFn = setInterval(() => {
    //                 this.blink = !this.blink;
    //               }, 500);

    const minutes = 1;
    this.fetchSummary();
    this.pollSummary = setInterval( () => {
      this.fetchSummary();
    }, minutes * 60000);
  }

  resetFilter(){
    this.queryParams = {
      q: '',
      per_page : 25,
      page: 1,
      type: 'all',
      from_date: null,
      to_date: null,
      sort_active: 'created_at',
      sort_direction: 'desc',
      filter_status: null,
      filter_date: null,
      unclaimed_only: true,
      transaction_type: null,
      payment_status: null
    };
    this.fetchLaundries();
  }

  ngOnInit() {

    const laundryState = this.stateService.get('laundry');
    if (laundryState) {
      if (laundryState.queryParams) {
        this.queryParams = laundryState.queryParams;
      }
      if (laundryState.laundries) {
        this.laundries = laundryState.laundries;
      }
    }

    this.stateService.set('laundry', null);

    this.poll();

    this.filterStatusChange();

    this.laundryService.query({
      params: {
        config: 1
      }
    }).subscribe(
      config => {
        const meta = this.laundryService.getMeta();
        const actions = meta.actions;
        for (const key in actions) {
          if (actions.hasOwnProperty(key)) {
            const element = actions[key];
            this.status.push({name: element, value: key});
          }
        }
        // this.fetchSummary();
      }
    );

    this.echoService.join('laundries', 'private');

    this.echoService.listen('laundries', 'NotifyLaundryPage').subscribe(
      data => {
        this.fetchLaundries();
      }
    );
  }



  ngOnDestroy(): void {
    this.echoService.leave('laundries');
    this.stateService.set('laundry', {
      queryParams: this.queryParams,
      laundries: this.laundries
    });
    clearInterval(this.pollSummary);
  }


  fetchSummary() {
    this.laundryService.queryRaw({
      params: {
        summary: 1
      }
    }).subscribe(
      data => {
        this.summary = data;
      }
    );


    // this.fetchingSummary = true;
    // this.http.get( this.laundryService.getResourceURI() + '?summary=1').subscribe(
    //   data => {
    //     this.summary = data;
    //     this.fetchingSummary = false;
    //   }
    // )

  }

  fetchLaundries(event: KeyboardEvent = null) {

    if (event != null && event.key !== 'Enter') {
      return;
    }

    this.isFetching = true;
    this.queryParams.from_date = moment(this._from_date).format('YYYY-MM-DD');
    this.queryParams.to_date = moment(this._to_date).format('YYYY-MM-DD');

    this.laundryService.query({
      params: this.queryParams
    }).subscribe(
      data => {
        this.laundries = data;
        this.laundries.forEach(laundry => {
          laundry.checkbox = false;
        });
        this.meta = this.laundryService.getMeta();
        this.isFetching = false;
        this._check_all = false;
        this.computeSummaryOfCheckedItems();
      }
    );
  }


  pageChange($event){
    this.queryParams.page = $event.pageIndex + 1;
    this.queryParams.per_page = $event.pageSize;
    this.fetchLaundries();
  }


  sortData($event){
    this.queryParams.sort_active = $event.active;
    this.queryParams.sort_direction = $event.direction;
    this.fetchLaundries();
  }

  filterStatusChange() {
    this.filter_date = [
      {
        value: '_yesterday',
        label: 'Yesterday'
      },
      {
        value: '_today',
        label: 'Today'
      },
    ];

    if ( !(this.queryParams.filter_status === '_done' ||
            this.queryParams.filter_status === '_overdue' ||
            this.queryParams.filter_status === '_payments' ||
            this.queryParams.filter_status === '_for_refund' )) {

      this.filter_date.push(
        {
          value: '_3hours_ahead',
          label: '3 Hours Ahead'
        });
      this.filter_date.push(
        {
          value: '_tomorrow',
          label: 'Tomorrow'
        });
      this.filter_date.push(
        {
          value: '_today_n_tomorrow',
          label: 'Today and Tommorrow'
        });
    }

    if (!this.queryParams.filter_date || this.queryParams.filter_status === '_done') {
      this.queryParams.filter_date = '_today';
    }
    this.fetchLaundries();
  }

  checkAll(e: MatCheckboxChange) {
    this.laundries.forEach(laundry => {
      laundry.checkbox = e.checked;
    });
    this.computeSummaryOfCheckedItems();
  }

  checkChange(e: MatCheckboxChange) {
    this._check_all = this._check_all && e.checked;
    this.computeSummaryOfCheckedItems();
  }

  computeSummaryOfCheckedItems() {
    this.summaryChecked.total_weight = 0;
    this.summaryChecked.total_amount = 0;
    this.summaryChecked.items = 0;
    let ctr = 0;
    this.laundries.forEach(laundry => {
      if (laundry.checkbox) {
        this.summaryChecked.total_weight += Number(laundry.regular_kg) + Number(laundry.beddings_kg);
        this.summaryChecked.total_amount += Number(laundry.total_amount);
        this.summaryChecked.items++;
      }
    });

    // this.toastr.clear();
    // if (ctr > 0) {
    //   const opt = {
    //     disableTimeOut: true,
    //     enableHtml: true
    //   };
    //   setTimeout( () => {
    //     this.toastr.info(`Total Weight: ${this.summaryChecked.total_weight} <br> Total Amount:
    //     ${this.summaryChecked.total_amount}`, `${ctr} selected`, opt);
    //   }, 300);
    // }

  }

  addAction(laundry: any){
    this.addActionService.show(laundry).then(
      () => {
          this.fetchLaundries();
      },
      () => {

      }
    )
  }

  setPayment(laundry) {
    this.paymentService.show(laundry).then(
      () => {
        this.fetchLaundries();
      },
      () => {

      }
    )
  }

  showSalesReportModal(_modal: NgbModalRef){
    this.modalService.open(_modal, {size: 'lg'});
    this.fetchSalesReport();
    this.userService.query({
      params: {
        user_group: "Laundry Shop",
      }
    }).subscribe(
      data => {
        this.laundry_users = data;
      }
    )
  }

  fetchSalesReport(){

    if(this.sales_report.date_filter == '_today'){
      this.sales_report.from_date = moment().toDate();
      this.sales_report.to_date = moment().toDate();
    }
    else if(this.sales_report.date_filter == '_yesterday'){
      this.sales_report.from_date = moment().subtract(1, 'day').toDate();
      this.sales_report.to_date = moment().subtract(1, 'day').toDate();
    }

    this.laundryService.queryRaw({
      params: {
        sales_report: 1,
        user_id: this.sales_report.user_id,
        from_date: moment(this.sales_report.from_date).format("YYYY-MM-DD"),
        to_date: moment(this.sales_report.to_date).format("YYYY-MM-DD"),
      }
    }).subscribe(
      data => {
        this.sales_report.data = data;
      }
    )
  }


  showImage(index: number, modal: NgbModalRef = null, laundry: any = null){
    if(laundry)
      this.selectedLaundry = laundry;

    if(index >= 0 && index < this.selectedLaundry.images.length){
      this.selectedImage = this.selectedLaundry.images[index];
      this.selectedImage.index = index;
    }

    if(modal)
      this.modalService.open(modal, {size:'lg'});

  }

}
