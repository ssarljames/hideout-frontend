import { EchoService } from 'angular-laravel-echo';
import { Meal } from 'app/models/meal/meal';
import { AddStatusModalService } from './add-status-modal/add-status-modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { OrderService } from 'app/services/orders';
import { Order } from 'app/models/order/order';
import { ModalService } from 'app/shared/services/modal/modal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class OrderShowComponent implements OnInit {

  order: Order;
  order_id: string;


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private orderService: OrderService,
              private modalService: ModalService,
              private addStatusModalService: AddStatusModalService,
              private echoService: EchoService,
              private toastr: ToastrService
              ) {
  }

  ngOnInit() {

    this.order_id = this.activatedRoute.snapshot.params['id'];

    this.fetchOrder();

    this.echoService.join(`orders.${ this.order_id }`, 'private');
    this.echoService.listen(`orders.${ this.order_id }`, 'OrderUpdated').subscribe(
      () => {
        this.fetchOrder();
        this.toastr.info('This order has been updated.');
      }
    );
    this.echoService.listen(`orders.${ this.order_id }`, 'OrderDeleted').subscribe(
      () => {
        this.toastr.warning('This order has been removed.');
        this.router.navigate(['/snack-hauz/orders']);
      }
    );
    this.echoService.listen(`orders.${ this.order_id }`, 'OrderMealCreated').subscribe(
      () => {
        this.fetchOrder();
        this.toastr.info('A meal has been added on this order.');
      }
    );

  }

  fetchOrder(): void{
    this.orderService.read( this.order_id ).subscribe(
      data => {
        this.order = data;
      }
    )
  }

  deleteOrder(): void{


    this.modalService.confirm({
      message: 'Are you sure to delete this order?',
      type: 'danger',
      withPrompt: true
    }).then(
      () => {
        this.orderService.delete(this.order.id).subscribe(
          data => {
            this.router.navigate(['/snack-hauz/orders']);
          }
        );
      },
      () => {

      }
    )

  }

  addAction(meal: Meal): void{

    if(this.order.status == 0){
      this.modalService.alert({message: 'You can\'t add action to this meal because the order is not placed yet.'});
      return;
    }

    this.addStatusModalService.showModal(meal).then(
      () => {
        this.fetchOrder();
      },
      () => {

      }
    )
  }

}
