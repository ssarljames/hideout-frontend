import { UserCreateComponent } from './create/create.component';
import { UserIndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserEditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: UserIndexComponent
  },
  {
    path: 'create',
    component: UserCreateComponent
  },
  {
    path: ':id/edit',
    component: UserEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
