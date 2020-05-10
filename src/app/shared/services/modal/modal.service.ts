import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { ConfirmationModalComponent } from 'app/shared/confirmation-modal/confirmation-modal.component';
import { AlertModalComponent } from 'app/shared/alert-modal/alert-modal.component';
import { PromptModalComponent } from 'app/shared/prompt-modal/prompt-modal.component';


export interface ConfirmationModalOption{
  message?: string,
  type?: 'default' | 'warning' | 'success' | 'danger' | 'info',
  withPrompt?: boolean
}

export interface AlertModalOption{
  message?: string,
  type?: 'default' | 'warning' | 'success' | 'danger' | 'info'
}


export interface PromptModalOption{
  message: string,
  type?: 'default' | 'warning' | 'success' | 'danger' | 'info',
  value?: string
}


@Injectable()
export class ModalService {

  constructor(private modalService: NgbModal) { }

  public confirm(option: ConfirmationModalOption): Promise<any>{
    const modal = this.modalService.open(ConfirmationModalComponent, { size: (option.withPrompt ? 'lg':'sm') });
    modal.componentInstance.message = option.message;
    modal.componentInstance.color = option.type;
    modal.componentInstance.withPrompt = option.withPrompt;
    return modal.result;
  }


  public alert(option: AlertModalOption): Promise<any>{
    const modal = this.modalService.open(AlertModalComponent, { size: 'sm' });
    modal.componentInstance.message = option.message;
    modal.componentInstance.color = option.type;
    return modal.result;
  }


  public prompt(option: PromptModalOption): Promise<any>{
    const modal: NgbModalRef = this.modalService.open(PromptModalComponent, { size: 'sm' });
    modal.componentInstance.message = option.message;
    modal.componentInstance.color = option.type;
    modal.componentInstance.value = option.value;
    return modal.result;
  }

}
