import { CashCountCreateComponent } from './create/create.component';
import { CashCountIndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CashCountIndexComponent
  },
  {
    path: 'create',
    component: CashCountCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashCountsRoutingModule { }
