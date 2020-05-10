import { ComposeSmsService } from './outbox/compose-modal/compose-modal.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsRoutingModule } from './sms-routing.module';
import { SmsIndexComponent } from './index/index.component';
import { InboxComponent } from './inbox/inbox.component';
import { OutboxComponent } from './outbox/outbox.component';
import { ComposeModalComponent } from './outbox/compose-modal/compose-modal.component';
import { DeviceInformationComponent } from './device-information/device-information.component';

@NgModule({
  declarations: [
    SmsIndexComponent,
    InboxComponent,
    OutboxComponent,
    ComposeModalComponent,
    DeviceInformationComponent
  ],
  imports: [
    CommonModule,
    SmsRoutingModule,
    SharedModule,
    NgbModule
  ],
  providers: [
    ComposeSmsService
  ],
  entryComponents: [
    ComposeModalComponent
  ]
})
export class SmsModule { }
