import { SharedModule } from 'app/shared/shared.module';
import { VaultIndexComponent } from './index/index.component';
import { VaultCreateComponent } from './create/create.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VaultRoutingModule } from './vault-routing.module';

@NgModule({
  declarations: [
    VaultCreateComponent,
    VaultIndexComponent
  ],
  imports: [
    CommonModule,
    VaultRoutingModule,
    SharedModule
  ]
})
export class VaultModule { }
