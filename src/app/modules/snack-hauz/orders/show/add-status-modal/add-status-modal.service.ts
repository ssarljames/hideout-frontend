import { AddStatusModalComponent } from './add-status-modal.component';
import { Meal } from 'app/models/meal/meal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';

@Injectable()
export class AddStatusModalService {

  constructor(private modalService: NgbModal) { }

  public showModal(meal: Meal): Promise<any>{
    const m = this.modalService.open(AddStatusModalComponent, { size: 'sm' });
    m.componentInstance.meal = meal;
    return m.result;
  }

}
