import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';


import {IndexComponent} from './index/index.component';
import {CreateComponent} from './create/create.component';
import {EditComponent} from './edit/edit.component';
import {ShowComponent} from './show/show.component';


@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    EditComponent,
    ShowComponent
  ],
  exports: [
    IndexComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SubscriptionsModule {
}
