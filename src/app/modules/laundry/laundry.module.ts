import { AddPaymentService } from './add-payment-modal/add-payment.service';
import { AddActionModalService } from './add-action-modal/add-action-modal.service';
import { SmsModule } from './../sms/sms.module';
import { LaundryEditComponent } from './edit/edit.component';
import { LaundryCreateComponent } from './create/create.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LaundryRoutingModule } from './laundry-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { LaundryIndexComponent } from './index/index.component';
import { LaundryShowComponent } from './show/show.component';


import { WebcamModule } from 'ngx-webcam';
import { MomentModule } from 'ngx-moment';
import { AddActionModalComponent } from './add-action-modal/add-action-modal.component';
import { AddPaymentModalComponent } from './add-payment-modal/add-payment-modal.component';

@NgModule({
  declarations: [
    LaundryIndexComponent,
    LaundryCreateComponent,
    LaundryEditComponent,
    LaundryShowComponent,
    AddActionModalComponent,
    AddPaymentModalComponent
  ],
  imports: [
    CommonModule,
    LaundryRoutingModule,
    SharedModule,
    WebcamModule,
    MomentModule,
    SmsModule
  ],
  providers: [
    AddActionModalService,
    AddPaymentService
  ],
  entryComponents: [
    AddActionModalComponent,
    AddPaymentModalComponent
  ]
})
export class LaundryModule { }
