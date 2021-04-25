import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { MaterialAutocompleteFetchOption } from '../material-autocomplete/material-autocomplete.component';

@Component({
  selector: 'app-material-autocomplete-chip',
  templateUrl: './material-autocomplete-chip.component.html',
  styleUrls: ['./material-autocomplete-chip.component.scss']
})
export class MaterialAutocompleteChipComponent implements OnInit, OnChanges, AfterViewChecked {


  @Input() control: FormControl;
  @Input() label: string;
  @Input() class: string;
  @Input() placeholder: string;
  @Input() icon: string;
  @Input() fetch: MaterialAutocompleteFetchOption<any>;
  @Input() autoActiveFirst: boolean;
  // @Input() defaultValue: MaterialAutoCompleteOption<any>;
  @Input() multiple: boolean = false;
  @Input('options') _options: MaterialAutoCompleteChipOption[] = [];

  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Output() onRemove: EventEmitter<any> = new EventEmitter();

  @Output() onSelectOption: EventEmitter<MaterialAutoCompleteChipOption> = new EventEmitter();
  @Output() onRemoveOption: EventEmitter<MaterialAutoCompleteChipOption> = new EventEmitter();
  @Input() disabled: boolean;
  @Input() allowAddEntry: boolean = false;
  @Input() removable: boolean = true;

  // @ViewChild('searchInput') searchInput: HTMLInputElement;

  options: MaterialAutoCompleteChipOption[] = [];

  isLoading: boolean = false;

  subscription: Subscription;
  @Input() appearance: 'legacy' | 'standard' | 'fill' | 'outline';

  @Output() onAddEntry: EventEmitter<any> = new EventEmitter;




  visible = true;
  selectable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  search;

  selectedItems: MaterialAutoCompleteChipOption[] = [];

  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {

    this.placeholder = this.placeholder ? this.placeholder : this.label;
    this.label = this.label ? this.label : this.placeholder;


    this.search = new FormControl({value: '', disabled: this.disabled})


    if (this.fetch) {

      this.subscription = this.search.valueChanges.pipe(
        map(v => {
          this.isLoading = true;
          return v;
        }),
        debounceTime(300),
        switchMap((value: string) => {
          if (value !== '' && typeof value === typeof '')
            return this.lookup(value);

          else
            return of(null);
        }
        )).subscribe(response => {
          if (response)
            this.options = this.fetch.mapResult(response);
          else
            this.options = [];

          this.isLoading = false;
        });
    }
    else {
      this.subscription = this.search.valueChanges.subscribe( (value: string) => {

        if (value == null){

        }
        else if(this._options.length)
          this.options = this._options.filter( o => {
            try {
              let matched = o.label.toLowerCase().indexOf(value.toLowerCase()) > -1

              if (matched)
                matched = this.selectedItems.findIndex(i => o.value == i.value) == -1

              return matched;

            }catch(e) {
              return true;
            }
          });

      })
    }

    if (this.control) {
      this.control.statusChanges.subscribe(a => {
        if (a == 'INVALID') {
          this.search.setErrors(this.control.errors);
          this.search.markAsTouched({ onlySelf: true });
        }
      });

      this.control.valueChanges.subscribe((value: string) => {
        if (!value)
          this.clearValue(true);
      })
    }


    this.appearance = this.appearance ? this.appearance : 'standard';


  }

  ngOnChanges(change: SimpleChanges): void {
    if (change.disabled && this.searchInput)
      // this.searchInput.nativeElement.setAttribute("disabled", change.disabled.currentValue ? 'true' : '');
      change.disabled.currentValue
        ? this.search.disable()
        : this.search.enable()

  }

  ngAfterViewChecked(): void {
    // this.disabled
    //   ? this.search.disable()
    //   : this.search.enable()
  }

  openDefault(): void {
    // this.lookup(this.search.value).subscribe( response => {
    //   if(response)
    //     this.options = this.fetch.mapResult(response);
    //   else
    //     this.options = [];

    //   this.isLoading = false;
    // });
    // this.matAutocomplete.
  }


  /** Http fetch */
  lookup(value: string): Observable<any> {
    const fnPayload = this.fetch.fnPayload ? this.fetch.fnPayload() : {};
    return this.http.get(this.fetch.url, {
      params: {
        ...this.fetch.payload,
        ...fnPayload,
        q: value
      }
    });
  }

  add(event: MatChipInputEvent): void {

  }

  remove(value: any): void {
    const index = this.selectedItems.findIndex(item => item.value == value);
    const option = this.selectedItems.find(item => item.value == value);

    if (index >= 0) {
      this.selectedItems.splice(index, 1);
      this.onRemoveOption.emit(option);
      this.onRemove.emit(value);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    const optionExists = this.options.findIndex(o => o.value == event.option.value) > -1;

    if (this.selectedItems.findIndex(item => item.value == event.option.value) == -1 && optionExists) {
      this.selectedItems.push(this.options.find(o => o.value == event.option.value));
      this.clearSearchBox();

      this.onSelect.emit(event.option.value);
      this.onSelectOption.emit(this.options.find(o => o.value == event.option.value));

      if(this._options == null || this._options.length == 0)
        this.options = this.options.filter(o => o.value == event.option.value);


    }

    if (optionExists == false && event.option.value == '---add-entry') {
      this.clearSearchBox();
      this.onAddEntry.emit();
    }
  }


  clearValue(fromSelf: boolean = false): void {
    // this.selected = '';
    this.search.setValue('');
    if (this.control && fromSelf == false)
      this.control.setValue(null);


      this.selectedItems = [];
  }

  clearSearchBox(): void {
    this.searchInput.nativeElement.value = "";
    this.search.setValue(null);
  }

  manualAddOnSelectedItems(option: MaterialAutoCompleteChipOption): void {
    this.selectedItems.push(option);
    this.clearSearchBox();

    this.onSelect.emit(option.value);
    this.onSelectOption.emit(option);
  }

}


export interface MaterialAutoCompleteChipOption {
  label: string;
  value: any;
  [key: string]: any;
}
