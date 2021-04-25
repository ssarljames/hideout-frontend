import { FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

export interface MaterialSelectOption<T = any> {
  value: any;
  label: string;
  object?: T;
  disabled?: boolean;
}

@Component({
  selector: 'app-material-select',
  templateUrl: './material-select.component.html',
  styleUrls: ['./material-select.component.scss']
})
export class MaterialSelectComponent implements OnInit {

  @Input() options: MaterialSelectOption<any>[];
  @Input() control: FormControl;
  @Input() label: string;
  @Input() class: string;
  @Input() placeholder: string;
  @Input() icon: string;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() emptyLabel: string = 'None';
  @Input() multiple: boolean = false;
  @Input() allowReset: boolean = false;

  @Input() selected: any;

  @Output() onSelect: EventEmitter<MaterialSelectOption> = new EventEmitter();

  @Input() appearance: 'legacy' | 'standard' | 'fill' | 'outline';
  constructor() { }

  ngOnInit(): void {
    this.placeholder = this.placeholder ? this.placeholder : this.label ;
    this.label = this.label ? this.label : this.placeholder ;
    this.appearance = this.appearance ? this.appearance : 'standard';
  }

  select(change: MatSelectChange): void {
    this.onSelect.emit(this.options.find( o => o.value == change.value))
  }
}
