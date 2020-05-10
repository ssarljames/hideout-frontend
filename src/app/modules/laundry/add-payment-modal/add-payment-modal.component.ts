import { CustomerService } from 'app/services/customer';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { LaundryService } from 'app/services/laundry';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-payment-modal',
  templateUrl: './add-payment-modal.component.html',
  styleUrls: ['./add-payment-modal.component.scss']
})
export class AddPaymentModalComponent implements OnInit {

  payment_methods = [];
  @Input() laundry: any;

  customer: any;

  cash_received = null;

  saving: boolean;

  constructor(private laundryService: LaundryService,
              private activeModal: NgbActiveModal,
              private customerService: CustomerService,
              private toastr: ToastrService) { }

  ngOnInit() {

    this.laundry.payment_method = null;
    this.cash_received = null;

    this.laundryService.query({
      params: {
        config: 1
      }
    }).subscribe(
      config => {
        this.payment_methods = [];
        const meta = this.laundryService.getMeta();
        const payment_methods = meta.config.payment_methods;
        for (const key in payment_methods) {
          if (payment_methods.hasOwnProperty(key)) {
            const element = payment_methods[key];
            const method = {name: element, value: key};
            this.payment_methods.push(method);
            if ( !this.laundry.payment_method ) {
              this.laundry.payment_method = method.value;
            }
          }
        }
        setTimeout( () => {
          const cash_received_input = document.getElementById('_cash_received') as HTMLElement;
          cash_received_input.focus();
        }, 500);
      }
    );


  }

  d(reason: string = null): void{
    this.activeModal.dismiss(reason);
  }

  savePayment(e: KeyboardEvent = null) {
    if (this.saving || (!(e && e.key === 'Enter') && e != null) ) {
      return;
    }
    this.saving = true;
    const laundry = this.laundry;
    const method = Number(laundry.payment_method);
    if (method === 2 && Number(laundry.remaining_balance) > Number(this.customer.available_points)) {
      this.toastr.error('Insufficient balance');
      this.saving = false;
      return;
    } else if (!method) {
      this.toastr.error('Payment method required');
      this.saving = false;
      return;
    }

    laundry.set_payment = 1;
    laundry.payment_amount = this.cash_received > laundry.remaining_balance ? laundry.remaining_balance : this.cash_received;
    this.laundryService.update(laundry).subscribe(
      data => {
        this.toastr.success('Laundry payment was set!');
        this.saving = false;
        this.activeModal.close();
      },
      fail => {
        this.toastr.error(fail.error.message);
        this.saving = false;
      }
    );
  }



  paymentMethodChanged() {
    const method = Number(this.laundry.payment_method);
    this.cash_received = null;
    if (method === 2) {
      this.customerService.read(this.laundry.customer_id).subscribe(
        data => {
          this.customer = data;
        }
      );
    } else {
      setTimeout( () => {
        const cash_received_input = document.getElementById('_cash_received') as HTMLElement;
        cash_received_input.focus();
      }, 500);
    }
  }

}
