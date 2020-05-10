import { VaultCreateComponent } from './create/create.component';
import { VaultIndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: VaultIndexComponent
  },
  {
    path: 'create',
    component: VaultCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VaultRoutingModule { }
