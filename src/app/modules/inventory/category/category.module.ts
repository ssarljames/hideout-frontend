import { InventoryCategoryCreateComponent } from './create/create.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryCategoryRoutingModule } from './category-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { InventoryCategoryIndexComponent } from './index/index.component';

@NgModule({
  declarations: [
    InventoryCategoryIndexComponent,
    InventoryCategoryCreateComponent
  ],
  imports: [
    CommonModule,
    InventoryCategoryRoutingModule,
    SharedModule
  ]
})
export class InventoryCategoryModule { }
