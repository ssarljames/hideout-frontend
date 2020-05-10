import { LaundryShowComponent } from './show/show.component';
import { LaundryEditComponent } from './edit/edit.component';
import { LaundryIndexComponent } from './index/index.component';
import { LaundryCreateComponent } from './create/create.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LaundryIndexComponent
  },
  {
    path: 'create',
    component: LaundryCreateComponent
  },
  {
    path: ':id/edit',
    component: LaundryEditComponent
  },
  {
    path: ':id',
    component: LaundryShowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaundryRoutingModule { }
