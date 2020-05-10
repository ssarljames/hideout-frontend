import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersIndexComponent } from './index/index.component';
import { OrderShowComponent } from './show/show.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersIndexComponent
  },
  {
    path: ':id',
    component: OrderShowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
