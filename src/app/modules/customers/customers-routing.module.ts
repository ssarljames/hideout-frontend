import { CustomerCreateComponent } from './create/create.component';
import { CustomerEditComponent } from './edit/edit.component';
import { CustomerShowComponent } from './show/show.component';
import { CustomerIndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CustomerIndexComponent
  },
  {
    path: 'create',
    component: CustomerCreateComponent
  },
  {
    path: ':id',
    component: CustomerShowComponent
  },
  {
    path: ':id/edit',
    component: CustomerEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
