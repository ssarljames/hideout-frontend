import { ModalService } from './services/modal/modal.service';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { EllipsisLoadingComponent } from './ellipsis-loading/ellipsis-loading.component';
import { PipeModule } from './../core/pipe/pipe.module';
import { MaterialModule } from 'app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Nl2BrPipeModule} from 'nl2br-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MenuItems } from './menu-items/menu-items';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { PromptModalComponent } from './prompt-modal/prompt-modal.component';


@NgModule({
  declarations: [
    EllipsisLoadingComponent,
    ConfirmationModalComponent,
    AlertModalComponent,
    PromptModalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    Nl2BrPipeModule,
    NgxPaginationModule,
    PipeModule,
  ],


  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    Nl2BrPipeModule,
    NgxPaginationModule,
    PipeModule,
    EllipsisLoadingComponent,
    PromptModalComponent
  ],
  providers: [
    MenuItems,
    ModalService
  ],
  entryComponents: [
    EllipsisLoadingComponent,
    ConfirmationModalComponent,
    AlertModalComponent,
    PromptModalComponent
  ]
})
export class SharedModule { }
