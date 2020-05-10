import { InventoryItemEditComponent } from './edit/edit.component';
import { InventoryIndexComponent } from './index/index.component';
import { InventoryCreateComponent } from './create/create.component';
import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryShowComponent } from './show/show.component';

@NgModule({
  declarations: [
    InventoryCreateComponent,
    InventoryIndexComponent,
    InventoryItemEditComponent,
    InventoryShowComponent,
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule
  ]
})
export class InventoryModule { }
