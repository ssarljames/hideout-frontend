import { StateService } from './../../../core/state.service';
import { AuthenticationService } from './../../../core/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerService } from 'app/services/customer';
import { Router } from '@angular/router';
import { fetchAnimation } from 'app/animations/animations';
import { Customer } from 'app/models/customer/customer';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations:[fetchAnimation]
})
export class CustomerIndexComponent implements OnInit, OnDestroy {
  customers : Customer[] = [];
  meta: any = {};

  pageSizeOptions: number[] = [5, 10, 25, 100];

  queryParams = {
    q: '',
    per_page : 15,
    page: 1,
    sort_active: 'name',
    sort_direction: 'asc'
  }
  isFetching = false;

  currentUser: any = {};

  constructor(private customerService: CustomerService,
    private stateService: StateService,
    private router: Router,
    private authenticationService: AuthenticationService) {
      this.currentUser = authenticationService.getCurrentUser();
  }

  ngOnInit() {

    const customers_state = this.stateService.get('customers');
    if(customers_state){
      if(customers_state.queryParams){
        this.queryParams = customers_state.queryParams;
      }
      if(customers_state.customers)
        this.customers = customers_state.customers;
    }

    this.fetchCustomers();
  }

  ngOnDestroy(): void {
    this.stateService.set('customers', {
      queryParams: this.queryParams,
      customers: this.customers
    });
  }


  fetchCustomers($event = null) {

    if ($event && $event.keyCode === 27) {
      this.queryParams.q = '';
    } else if (this.isFetching || ($event && $event.keyCode !== 27)) {
      return;
    }

    if ($event ) {
      this.queryParams.page = 1;
    }


    this.isFetching = true;
    this.customerService.query({
      params: this.queryParams,
    }).subscribe(
         data => {
           this.customers = data;
           this.isFetching = false;
           this.meta = this.customerService.getMeta();

         }
      );
  }

  showCustomerDetail(id){
    this.router.navigate(['customers', id]);
  }

  pageChange(event){
    this.queryParams.page = event.pageIndex + 1;
    this.queryParams.per_page = event.pageSize;
    this.fetchCustomers()
  }

  sortData($event){
    this.queryParams.sort_active = $event.active;
    this.queryParams.sort_direction = $event.direction;
    this.queryParams.page = 1;
    this.fetchCustomers();
  }
}
