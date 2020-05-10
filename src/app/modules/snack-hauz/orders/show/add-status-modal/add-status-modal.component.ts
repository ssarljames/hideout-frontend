import { Meal } from 'app/models/meal/meal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { OrderMealService } from 'app/services/order-meal';
import { ModalService } from 'app/shared/services/modal/modal.service';

@Component({
  selector: 'app-add-status-modal',
  templateUrl: './add-status-modal.component.html',
  styleUrls: ['./add-status-modal.component.scss']
})
export class AddStatusModalComponent implements OnInit {

  @Input() meal: Meal;

  statusAvailable: any[] = [];

  constructor(private activeModal: NgbActiveModal,
              private orderMealService: OrderMealService,
              private modalService: ModalService) {}

  ngOnInit() {
    this.orderMealService.getStatusAvailable(this.meal.pivot.id).subscribe(
      data => {
        this.statusAvailable = data;//.filter( (d) => d.value > this.meal.pivot.status);
      }
    )
  }

  selectStatus(status: any): void{

    if(this.statusAvailable == this.meal.pivot.status)
      return;

    this.modalService.confirm({
      message: 'Update status?',
      type: status.color,
      withPrompt: status.value == 4
    }).then(
      () => {

        this.orderMealService.update({
          id: this.meal.pivot.id,
          status: status.value
        }).subscribe(
          data => {
            this.close();
          }
        );

      },
      () => {
        this.dismiss();
      }
    )
  }

  close(): void{
    this.activeModal.close();
  }

  dismiss(): void{
    this.activeModal.dismiss();
  }
}
