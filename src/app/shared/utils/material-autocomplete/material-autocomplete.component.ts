import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, switchMap } from 'rxjs/operators';


export interface MaterialAutoCompleteOption<T> {
  value: any;
  label: string;
  object?: T;
}

export interface MaterialAutocompleteFetchOption<T> {
  url: string;
  payload?: any;
  mapResult(result: any): MaterialAutoCompleteOption<T>[];
  fnPayload(): any;
}

@Component({
  selector: 'app-material-autocomplete',
  templateUrl: './material-autocomplete.component.html',
  styleUrls: ['./material-autocomplete.component.scss']
})
export class MaterialAutocompleteComponent implements OnInit, OnDestroy, OnChanges {

  @Input() control: FormControl;
  @Input() label: string;
  @Input() class: string;
  @Input() placeholder: string;
  @Input() icon: string;
  @Input() source: MaterialAutoCompleteOption<any>[];
  @Input() fetch: MaterialAutocompleteFetchOption<any>;
  @Input() autoActiveFirst: boolean;
  @Input() defaultValue: MaterialAutoCompleteOption<any>;
  @Input() multiple: boolean = false;

  @Output() onSelect: EventEmitter<any> =  new EventEmitter();
  @Output() onSelectOption: EventEmitter<MaterialAutoCompleteOption<any>> =  new EventEmitter();
  @Input() disabled: boolean;

  // @ViewChild('searchInput') searchInput: HTMLInputElement;

  selected: string = '';

  options: MaterialAutoCompleteOption<any>[] = [];

  search: FormControl;

  isLoading: boolean = false;

  subscription: Subscription;
  @Input() appearance: 'legacy' | 'standard' | 'fill' | 'outline';

  constructor(private http: HttpClient) {

    this.search = new FormControl('');

  }

  ngOnInit(): void {

    if(this.source)
      this.options = this.source;

    this.placeholder = this.placeholder ? this.placeholder : this.label ;
    this.label = this.label ? this.label : this.placeholder ;


    if(this.fetch){

      this.subscription = this.search.valueChanges.pipe(
        debounceTime(300),
        switchMap(value => {
          if (value !== '' && typeof value === typeof '')
            return this.lookup(value);

          else
            return of(null);
        }
      )).subscribe( response => {
        if(response)
          this.options = this.fetch.mapResult(response);
        else
          this.options = [];

        this.isLoading = false;
      });
    }
    else{
      this.subscription = this.search.valueChanges.subscribe( (value: string) => {
        if(this.source)
          this.options = this.source.filter( o => o.label.toLowerCase().indexOf(value.toLowerCase()) > -1);
      })
    }

    this.control.statusChanges.subscribe( a => {
      if(a == 'INVALID'){
        this.search.setErrors(this.control.errors);
        this.search.markAsTouched({ onlySelf: true });
      }
    });

    this.control.valueChanges.subscribe( (value: string) => {
      if (!value)
        this.clearValue(true);
    })


    this.appearance = this.appearance ? this.appearance : 'standard';

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.defaultValue && changes.defaultValue.currentValue){
      this.control.setValue(changes.defaultValue.currentValue.value);
      this.selected = changes.defaultValue.currentValue.label;
    }


    if (changes.disabled)
      if (changes.disabled.currentValue)
        this.search.disable();
      else
        this.search.enable();
  }

  /** Http fetch */
  lookup(value: string): Observable<any>{
    this.isLoading = true;
    return this.http.get(this.fetch.url, {
      params: {
        ...this.fetch.payload,
        ...this.fetch.fnPayload(),
        q: value
      }
    });
  }

  select(e: MatAutocompleteSelectedEvent): void{
    if(this.control){
      this.control.setValue(e.option.value);
      this.selected = e.option.viewValue;
    }
    else{
      this.selected = '';
      this.search.setValue('');
    }
    this.onSelect.emit(e.option.value);
    this.onSelectOption.emit( this.options.find( o => o.value == e.option.value));
    this.options = [];
  }


  clearValue(fromSelf: boolean = false): void{
    this.selected = '';
    this.search.setValue('');
    if(this.control && fromSelf == false)
      this.control.setValue(null);

    // setTimeout( () => {
    //   this.searchInput.focus();
    // }, 300);
  }


}
