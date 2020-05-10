import { EchoService } from 'angular-laravel-echo';
import { Router } from '@angular/router';
import { StateService } from 'app/core/state.service';
import { Order } from './../../../../models/order/order';
import { OrderService } from './../../../../services/orders';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class OrdersIndexComponent implements OnInit, OnDestroy {



  orders: Order[];

  constructor(private orderService: OrderService,
              private stateService: StateService,
              private router: Router,
              private echoService: EchoService,
              private toastr: ToastrService) { }

  ngOnInit() {
    const orders_state = this.stateService.get('orders');
    if(orders_state){
      this.orders = orders_state.orders;
    }
    this.fetchOrders();

    this.echoService.join('orders', 'private');

    this.echoService.listen('orders', 'OrderCreated').subscribe(
      () => {
        this.toastr.info("New order has been created by a customer.");
        this.fetchOrders();
      }
    );

    this.echoService.listen('orders', 'OrderUpdated').subscribe(
      () => {
        this.fetchOrders();
      }
    )

    this.echoService.listen('orders', 'OrderWasPlaced').subscribe(
      () => {
        this.fetchOrders();
        this.toastr.info("New order has been placed");
      }
    )

  }

  ngOnDestroy(): void {
    this.stateService.set('orders',{
      orders: this.orders
    });
  }

  fetchOrders(){
    this.orderService.query().subscribe(
      (data: Order[]) => {
        this.orders = data;
      }
    )
  }

  showOrder(id: number): void{
    this.router.navigate([`snack-hauz/orders/${ id }`]);
  }

}
