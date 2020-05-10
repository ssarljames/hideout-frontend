import { SnackHauzIndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   component: SnackHauzIndexComponent
  // },
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'menus',
    loadChildren: './menus/menus.module#MenusModule'
  },
  {
    path: 'orders',
    loadChildren: './orders/orders.module#OrdersModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SnackHauzRoutingModule { }
