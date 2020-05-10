import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SnackHauzRoutingModule } from './snack-hauz-routing.module';
import { SharedModule } from 'app/shared/shared.module';

import { ImageCropperModule } from 'ngx-image-cropper';
import { SnackHauzIndexComponent } from './index/index.component';

@NgModule({
  declarations: [
    SnackHauzIndexComponent
  ],
  imports: [
    CommonModule,
    SnackHauzRoutingModule,
    SharedModule,
    //ImageCropperModule
  ]
})
export class SnackHauzModule { }
