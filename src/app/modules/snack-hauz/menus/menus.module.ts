import { MenusIndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenusRoutingModule } from './menus-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { MealFormModalComponent } from './modals/meal-form-modal/meal-form-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    MenusIndexComponent,
    MealFormModalComponent
  ],
  imports: [
    CommonModule,
    MenusRoutingModule,
    SharedModule
  ],
  exports: [
    MealFormModalComponent,
    NgbModule
  ],
  entryComponents: [
    MealFormModalComponent
  ]
})
export class MenusModule { }
