import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternetServiceRoutingModule } from './internet-service-routing.module';
import { IndexComponent } from './index/index.component';
import {SharedModule} from '../../shared/shared.module';
import {PlansModule} from './plans/plans.module';
import {SubscriptionsModule} from './subscriptions/subscriptions.module';


@NgModule({
  declarations: [
    IndexComponent,
  ],
  imports: [
    CommonModule,
    InternetServiceRoutingModule,
    SharedModule,
    PlansModule,
    SubscriptionsModule
  ]
})
export class InternetServiceModule { }
