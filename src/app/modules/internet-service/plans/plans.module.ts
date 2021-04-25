import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    EditComponent,
  ],
  exports: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PlansModule { }
