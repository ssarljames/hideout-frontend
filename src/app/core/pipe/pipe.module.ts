import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterNamePipe } from './filter-name/filter-name.pipe';

@NgModule({
  declarations: [FilterNamePipe],
  imports: [
    CommonModule
  ],
  exports: [
    FilterNamePipe
  ]
})
export class PipeModule { }
