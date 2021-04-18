import { ComposeModalComponent } from './compose-modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';

export interface ComposeSmsParamsInterface{
  receiver: string,
  message: string,
  args?: any
}

@Injectable()
export class ComposeSmsService {

  constructor(private modal: NgbModal) { }

  public compose(param: ComposeSmsParamsInterface): Promise<any>{
    const modal: NgbModalRef = this.modal.open( ComposeModalComponent, { size: 'sm', backdrop: 'static'});
    modal.componentInstance.receiver = param.receiver;
    modal.componentInstance.message = param.message;
    modal.componentInstance.args = param.args;
    return modal.result;
  }
}
