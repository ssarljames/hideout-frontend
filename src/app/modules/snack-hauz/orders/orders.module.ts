import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddStatusModalService } from './show/add-status-modal/add-status-modal.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersIndexComponent } from './index/index.component';
import { SharedModule } from 'app/shared/shared.module';
import { OrderShowComponent } from './show/show.component';
import { AddStatusModalComponent } from './show/add-status-modal/add-status-modal.component';

@NgModule({
  declarations: [
    OrdersIndexComponent,
    OrderShowComponent,
    AddStatusModalComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    NgbModule,
    SharedModule
  ],
  exports: [
    AddStatusModalComponent
  ],
  providers: [
    AddStatusModalService
  ],
  entryComponents: [
    AddStatusModalComponent
  ]
})
export class OrdersModule { }
