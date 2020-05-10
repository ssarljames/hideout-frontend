import { ConfigurationIndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationsRoutingModule } from './configurations-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { UserGroupModalComponent } from './modals/user-group-modal/user-group-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComputerStationFormModalComponent } from './modals/computer-station-form-modal/computer-station-form-modal.component';

@NgModule({
  declarations: [
    ConfigurationIndexComponent,
    UserGroupModalComponent,
    ComputerStationFormModalComponent
  ],
  imports: [
    CommonModule,
    ConfigurationsRoutingModule,
    SharedModule,
    NgbModule
  ],
  // exports: [
  //   UserGroupModalComponent
  // ],
  entryComponents: [
    UserGroupModalComponent,
    ComputerStationFormModalComponent
  ]
})
export class ConfigurationsModule { }
