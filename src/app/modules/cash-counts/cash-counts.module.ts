import { CashCountIndexComponent } from './index/index.component';
import { CashCountCreateComponent } from './create/create.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashCountsRoutingModule } from './cash-counts-routing.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    CashCountCreateComponent,
    CashCountIndexComponent
  ],
  imports: [
    CommonModule,
    CashCountsRoutingModule,
    SharedModule
  ]
})
export class CashCountsModule { }
