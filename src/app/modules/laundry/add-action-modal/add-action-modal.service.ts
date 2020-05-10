import { AddActionModalComponent } from './add-action-modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';

@Injectable()
export class AddActionModalService {

  constructor(private modalService: NgbModal) { }


  public show(laundry: any): Promise<any>{

      const modal: NgbModalRef = this.modalService.open( AddActionModalComponent, { size: 'sm'});
      modal.componentInstance.laundry = laundry;

      return modal.result;
  }
}
