import { AddPaymentModalComponent } from './add-payment-modal.component';
import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class AddPaymentService {

  constructor(private modalService: NgbModal) { }


  public show(laundry): Promise<any> {
    const modal: NgbModalRef = this.modalService.open( AddPaymentModalComponent, { size: 'sm'});
    modal.componentInstance.laundry = laundry;

    return modal.result;
  }
}
