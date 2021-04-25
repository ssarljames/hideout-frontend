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
import {MaterialInputComponent} from './utils/material-input/material-input.component';
import {MaterialTextareaComponent} from './utils/material-textarea/material-textarea.component';
import {MaterialAutocompleteComponent} from './utils/material-autocomplete/material-autocomplete.component';
import {MaterialDatepickerComponent} from './utils/material-datepicker/material-datepicker.component';
import {MaterialAutocompleteChipComponent} from './utils/material-autocomplete-chip/material-autocomplete-chip.component';
import {MaterialSelectComponent} from './utils/material-select/material-select.component';

const FOR_EXPORT = [
  EllipsisLoadingComponent,
  ConfirmationModalComponent,
  AlertModalComponent,
  PromptModalComponent,
  EllipsisLoadingComponent,
  MaterialInputComponent,
  MaterialTextareaComponent,
  MaterialAutocompleteComponent,
  MaterialSelectComponent,
  MaterialDatepickerComponent,
  MaterialAutocompleteChipComponent,
]

@NgModule({
  declarations: [
    ...FOR_EXPORT
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
    PromptModalComponent,
    MaterialInputComponent,
    MaterialTextareaComponent
  ],
  providers: [
    MenuItems,
    ModalService
  ],
  entryComponents: [
    ...FOR_EXPORT
  ]
})
export class SharedModule { }
