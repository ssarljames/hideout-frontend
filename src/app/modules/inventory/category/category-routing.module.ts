import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryCategoryIndexComponent } from './index/index.component';
import { InventoryCategoryCreateComponent } from './create/create.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryCategoryIndexComponent
  },
  {
    path: 'create',
    component: InventoryCategoryCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryCategoryRoutingModule { }
