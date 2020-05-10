import { CustomerFormComponent } from './form/form.component';
import { CustomerEditComponent } from './edit/edit.component';
import { CustomerShowComponent } from './show/show.component';
import { CustomerCreateComponent } from './create/create.component';
import { CustomerIndexComponent } from './index/index.component';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    CustomerIndexComponent,
    CustomerCreateComponent,
    CustomerShowComponent,
    CustomerEditComponent,
    CustomerFormComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule
  ]
})
export class CustomersModule { }
