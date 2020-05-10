import { UserIndexComponent } from './index/index.component';
import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserCreateComponent } from './create/create.component';
import { UserEditComponent } from './edit/edit.component';

@NgModule({
  declarations: [
    UserIndexComponent,
    UserCreateComponent,
    UserEditComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule { }
