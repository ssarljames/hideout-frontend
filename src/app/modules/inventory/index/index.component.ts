import { Component, OnInit, OnDestroy } from '@angular/core';
import { InventoryItemService } from 'app/services/inventory_item';
import { fetchAnimation } from 'app/animations/animations';
import { AuthenticationService } from 'app/core/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { EchoService } from 'angular-laravel-echo';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations:[fetchAnimation]
})
export class InventoryIndexComponent implements OnInit, OnDestroy {


  form: FormGroup;

  queryParams: any = {
    q: '',
    page: 1,
    per_page: 50,
    sort_active: 'name',
    sort_direction: 'asc'

  };



  meta: any = {};

  inventoryItems: any = null;
  isFetching = false;
  isAdmin: boolean;

  isAdding: boolean;
  selectedItem: any;

  quantity: any = '';
  error_msg: string = '';

  summary: any = {};

  constructor(private inventoryItemService: InventoryItemService,
              private authenticationService: AuthenticationService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private http: HttpClient,
              private echoService: EchoService) {

    this.isAdmin = this.authenticationService.getCurrentUser().is_administrator;
    const formControls = {
      quantity: new FormControl('', Validators.required),
      remarks: new FormControl(''),
      recount: new FormControl(true)
    }
    this.form = new FormGroup(formControls);
  }

  ngOnInit() {
    this.fetchInventoryItems();

    this.echoService.join('inventory', 'private');
    this.echoService.listen('inventory', 'InventoryTransactionCreated').subscribe(
      data => {
        this.fetchInventoryItems();

      }
    );
  }

  ngOnDestroy(): void {
    this.echoService.leave('inventory');
  }

  fetchInventoryItems(event: KeyboardEvent = null) {
    if (this.isFetching || (event && event.key !== 'Enter')) {
      return;
    }

    this.isFetching = true;
    this.inventoryItemService.query({
      params: this.queryParams
    }).subscribe(
      data => {
        this.inventoryItems = data;
        this.isFetching = false;
        this.meta = this.inventoryItemService.getMeta();
        this.fetchSummary();
      }
    );
  }

  fetchSummary() {
    this.inventoryItemService.query({
      params: {
        summary: true
      }
    }).subscribe(
      data => {
        this.summary = this.inventoryItemService.getMeta();
      }
    )
  }


  openTransactionModal(content, item, isAdding: boolean) {
    if (item.no_of_stocks <= 0 && !isAdding) {
      this.toastr.error('This action is not allowed if stock is zero');
      return;
    }

    this.isAdding = isAdding;
    this.selectedItem = item;
    this.form.reset();
    this.modalService.open(content, {windowClass: 'modal-holder', size: 'sm'});
  }

  saveTransaction() {
    if (this.form.invalid) {
      return;
    }

    this.quantity = this.form.controls.quantity.value;

    if (isNaN(this.quantity) || this.quantity === '') {
      this.form.controls.quantity.setErrors([ 'Must be a number']);
      return;
    }

    if (this.form.controls.recount.value) {
      let num = Math.round(Math.random()* 10);
      let num2 = Math.round(Math.random()* 10);
      let ans = prompt(`Are you sure to recount stock? Please answer the question if you're sure.\n\n${num} + ${num2} = ?`);
      if (Number(ans) !== (num + num2)) {
        return;
      }
    }

    const quantity = this.isAdding ? parseInt(this.quantity) : parseInt(this.quantity) * -1;

    this.http.post(`${environment.apiUrl}/inventory-items/${this.selectedItem.id}/transactions`,{
      quantity: quantity,
      remarks: this.form.controls.remarks.value,
      recount: this.form.controls.recount.value
    }).subscribe(
      data => {
        this.modalService.dismissAll();
        this.toastr.success('New transaction was saved!');
        this.fetchInventoryItems();
        this.form.reset();
      },
      error => {
        if (error.error.not_enough) {
          this.form.controls.quantity.setErrors([error.error.not_enough]);
        }


      }
    )
  }

  pageChange($event) {
    this.queryParams.page = $event.pageIndex + 1;
    this.queryParams.per_page = $event.pageSize;
    this.fetchInventoryItems();
  }


  sortData($event) {
    this.queryParams.sort_active = $event.active;
    this.queryParams.sort_direction = $event.direction;
    this.fetchInventoryItems();
  }

}
