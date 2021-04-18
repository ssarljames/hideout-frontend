import { InventoryCreateComponent } from './create/create.component';
import { InventoryShowComponent } from './show/show.component';
import { InventoryIndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryItemEditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryIndexComponent,
  },
  {
    path: 'categories',
    loadChildren: () => import('./category/category.module').then(m => m.InventoryCategoryModule)
  },
  {
    path: 'create',
    component: InventoryCreateComponent
  },
  {
    path: ':id/edit',
    component: InventoryItemEditComponent
  },
  {
    path: ':id',
    component: InventoryShowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
