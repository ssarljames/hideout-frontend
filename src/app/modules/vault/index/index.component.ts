import { AuthenticationService } from './../../../core/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { VaultEntryService } from 'app/services/vault_entry';

import * as moment from 'moment';
import { fetchAnimation } from 'app/animations/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EchoService } from 'angular-laravel-echo';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [fetchAnimation]
})
export class VaultIndexComponent implements OnInit, OnDestroy {

  _from_date: Date;
  _to_date: Date;
  today: Date;

  queryParams: any = {
    q: '',
    per_page: 15,
    page: 1,
    sort_active: 'created_at',
    sort_direction: 'desc',
    type: -1,
    from_date: null,
    to_date: null
  }

  vault_entries: any[] = [];

  meta: any = {};

  isAdmin = false;

  isFetching = false;

  current_balance: any = null;

  selected_vault_entry: any = {};

  types: any[] = [];


  changeEntry = {
    d1000: '',
    d500: '',
    d200: '',
    d100: '',
    d50: '',
    d20: '',
    d10: '',
    d5: '',
    d1: '',
    d25c: '',
    type: null,
    remarks: ''
  };

  showChangeForm = false;

  constructor(private vaultEntryService: VaultEntryService,
              private authenticationService: AuthenticationService,
              private modalService: NgbModal,
              private echoService: EchoService,
              private toastr: ToastrService) {

      this.isAdmin = authenticationService.getCurrentUser().is_administrator;

      // this._from_date = moment().toDate();
      // this._to_date = moment().toDate();
      this.today = moment().toDate();
  }

  ngOnInit() {
    this.fetchSummary();
    this.echoService.join('vault-entries', 'private')
        .listen('vault-entries', 'VaultEntryCreated')
        .subscribe(
          data => {
            this.fetchSummary();
          }
        )
  }

  ngOnDestroy(): void {
    this.echoService.leave('vault-entries');
  }

  fetchSummary() {

    if (this.isFetching) {
      return;
    }

    if (this._from_date) {
      this.queryParams.from_date = moment(this._from_date).format('YYYY-MM-DD');
    }
    if (this._to_date) {
      this.queryParams.to_date = moment(this._to_date).format('YYYY-MM-DD');
    }

    const q: any = JSON.parse(JSON.stringify(this.queryParams));
    q.count_total = 1;

    this.vaultEntryService.query({
      params: q
    }).subscribe(
      data => {
        this.meta = this.vaultEntryService.getMeta();
        this.fetchVaultEntries();

      }
    );
  }

  fetchVaultEntries(event: KeyboardEvent = null) {

    if (this.isFetching || (event && event.key !== 'Enter')) {
      return;
    }

    if (this._from_date) {
      this.queryParams.from_date = moment(this._from_date).format('YYYY-MM-DD');
    }
    if (this._to_date) {
      this.queryParams.to_date = moment(this._to_date).format('YYYY-MM-DD');
    }
    this.isFetching = true;
    this.vaultEntryService.query({
      params: this.queryParams
    }).subscribe(
      data => {
        this.vault_entries = data;
        this.meta = this.vaultEntryService.getMeta();
        this.isFetching = false;

        if (this.types.length === 0) {
          this.vaultEntryService.getTypes().subscribe(
            data => {
              for (const key in data) {
                if (data.hasOwnProperty(key)) {
                  const element = data[key];
                  this.types.push({name: element, value: key})
                }
              }
            }
          );
        }
      }
    )
  }


  pageChange(event: any) {
    this.queryParams.page = event.pageIndex + 1;
    this.queryParams.per_page = event.pageSize;
    this.fetchVaultEntries()
  }

  sortData($event: any) {
    this.queryParams.sort_active = $event.active;
    this.queryParams.sort_direction = $event.direction;
    this.queryParams.page = 1;
    this.fetchVaultEntries();
  }


  openModal(content: any, vault_entry: any) {
    this.showChangeForm = false;
    this.selected_vault_entry = vault_entry;
    this.modalService.open(content, {windowClass: 'modal-holder', size: 'sm'});
  }

  deleteVaultEntry(entry: any) {
    if (!confirm('Are you sure to delete this entry?')) {
      return;
    }
    const num = Math.round(Math.random() * 10) + 2;
    const num2 = Math.round(Math.random() * 10) + 2;
    const ans = prompt(`Please answer the question if you're sure.\n\n${num} x ${num2} = ?`);
    if (Number(ans) !== (num * num2)) {
      return;
    }

    this.vaultEntryService.delete(entry.id).subscribe(
      data => {
        this.fetchSummary();
        this.toastr.info('An entry was deleted!');
      }
    );
  }


  isWithdraw(): boolean{
    return !(Number(this.selected_vault_entry.type) === 0 || Number(this.selected_vault_entry.type) === 9);
  }

  isDeduction(): boolean {
    return !(Number(this.selected_vault_entry.type) === 0
              || Number(this.selected_vault_entry.type) === 1
              || Number(this.selected_vault_entry.type) === 8
              || Number(this.selected_vault_entry.type) === 9);
  }

  toggleChangeForm() {
    if (!this.showChangeForm) {
      this.showChangeForm = true;
    } else {
      const change = JSON.parse(JSON.stringify(this.changeEntry));

      for (const key in change) {
        if (change.hasOwnProperty(key)) {
          const element = change[key];
          if ( (!this.isNormalInteger(element) || Number(element) <= 0) && key.search('d') > -1) {
            change[key] = 0;
          } else {
            if ( key.search('d') > -1) {
              change[key] = Number(change[key]) * -1;
              console.log(change[key]);
            }

          }
        }
      }

      const total_change = (change.d1000 * 1000) +
                          (change.d500 * 500) +
                          (change.d200 * 200) +
                          (change.d100 * 100) +
                          (change.d50 * 50) +
                          (change.d20 * 20) +
                          (change.d10 * 10) +
                          (change.d5 * 5) +
                          (change.d1) +
                          (change.d25c * 0.25) + Number(this.selected_vault_entry.total);

      if (total_change >= 0) {
        change.type = this.selected_vault_entry.type;
        change.remarks = 'Change Only';
        console.log(change);

        this.vaultEntryService.create( change ).subscribe(
          data => {
            this.modalService.dismissAll();
            this.fetchSummary();
          }
        )

      } else {
        alert('Total change must be less than original amount');
      }

    }
  }


  isNormalInteger(str: any) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
  }
}
