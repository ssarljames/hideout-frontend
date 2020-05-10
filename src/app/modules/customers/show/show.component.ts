import { AuthenticationService } from './../../../core/auth.service';
import { CustomerService } from 'app/services/customer';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class CustomerShowComponent implements OnInit {
  customer_id: number;
  customer: any = {};

  currentUser: any = {};

  total_laundry: number = 0;

  constructor(private route: ActivatedRoute,
              private customerService: CustomerService,
              private authenticationService: AuthenticationService,
              private toaster: ToastrService,
              private router: Router) {
                this.currentUser = this.authenticationService.getCurrentUser();
                 }

  ngOnInit() {
    this.customer_id = Number(this.route.snapshot.params['id']);
    this.fetchCustomer();
  }

  fetchCustomer(){
    this.total_laundry = 0;
    this.customerService.read(this.customer_id).subscribe(
      data => {
        this.customer = data;
        this.customer.laundry_transactions.forEach(laundry => {
          this.total_laundry += Number(laundry.total_amount);
        });
      }
    );
  }

  addPoints(){
    const customer = this.customer;
    customer.add_points = 1;
    this.customerService.update(customer).subscribe(
      data => {
        this.customer = data;
      }
    );
  }

  deleteCustomer(){
    if (!confirm('Are you sure to delete this customer?')) {
      return;
    }


    const num = Math.round(Math.random() * 10) + 2;
    const num2 = Math.round(Math.random() * 10) + 2;
    const ans = prompt(`Please answer the question to proceed.\n\n${num} x ${num2} = ?`);
    if (Number(ans) !== (num * num2)) {
      return;
    }


    this.customerService.delete(this.customer_id).subscribe(
      data => {
        this.toaster.success('Customer was deleted successfully!');
        this.router.navigate(['/customers']);
      }
    )
  }
}
