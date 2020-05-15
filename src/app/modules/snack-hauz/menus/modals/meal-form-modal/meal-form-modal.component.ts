import { MatAutocompleteSelectedEvent } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, Output } from '@angular/core';
import { Meal } from 'app/models/meal/meal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MealService } from 'app/services/meal';
import { Observable, of } from 'rxjs';
import { startWith, debounceTime, switchMap } from 'rxjs/operators';
import { InventoryItemService } from 'app/services/inventory_item';

@Component({
  selector: 'app-meal-form-modal',
  templateUrl: './meal-form-modal.component.html',
  styleUrls: ['./meal-form-modal.component.scss']
})
export class MealFormModalComponent implements OnInit, OnChanges, OnDestroy {

  @Input() meal_id: string;
  @Input() meal_category_id: string;
  @Output() callback: Function;

  mealForm: FormGroup;
  selectedMeal: Meal;

  inventoryItemNameAutoComplete: FormControl;
  inventoryItems$: Observable<any> = null;


  addonsAutoComplete: FormControl;
  addons$: Observable<Meal> = null;

  isFetchingMeal: boolean = false;

  imageFile: any;
  imageSrc: string;

  constructor(private activeModal: NgbActiveModal,
              private mealService: MealService,
              private inventoryItemService: InventoryItemService) {


              this.inventoryItemNameAutoComplete = new FormControl('');
              this.addonsAutoComplete = new FormControl('');

              this.mealForm = new FormGroup({
                id: new FormControl(),
                name: new FormControl(),
                description: new FormControl(),
                price: new FormControl(),
                meal_category_id: new FormControl(),
                preparation_time: new FormControl(),
              });

              this.meal_id = "";
              this.selectedMeal = null;


  }



  ngOnInit() {


    this.fetchMeal();

    this.inventoryItems$ = this.inventoryItemNameAutoComplete.valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          switchMap(value => {
            if (value !== '' && typeof value === typeof '') {
              return this.inventoryItemService.query({
                params: {
                  category: 'snack-hauz',
                  q: value
                }
              });
            } else {
              return of(null);
            }
          }
    ));

    this.addons$ = this.addonsAutoComplete.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        if (value !== '' && typeof value === typeof '') {
          return this.mealService.query({
            params: {
              exclude_meal_id: this.selectedMeal ? this.selectedMeal.id : null,
              availability: 'all',
              q: value
            }
          });
        } else {
          return of(null);
        }
      })
    );
  }

  ngOnDestroy(){

  }

  ngOnChanges(changes: SimpleChanges){

  }

  displayInventoryItemFn(inventoryItem?: any): string | undefined {
    return inventoryItem ? inventoryItem.name : undefined;
  }

  displayaddonFn(addon: Meal): string{
    return addon ? addon.name : undefined;
  }

  selectInventoryItem(e: MatAutocompleteSelectedEvent){
    console.log(e.option.value);

    let found = false;
    this.selectedMeal.inventory_items.forEach( item => {
      found = found || item.id == e.option.value.id;
    })

    if(!found){
      let obj = e.option.value;
      obj.item_count = 1;
      obj.add_on_type = 0;
      obj.add_on_price = 0;
      this.selectedMeal.inventory_items.push(obj);
    }

    this.inventoryItemNameAutoComplete.setValue('');
  }

  selectaddon(e: MatAutocompleteSelectedEvent): void{

    let found = false;
    this.selectedMeal.addons.forEach( item => {
      found = found || item.id == e.option.value.id;
    })

    console.log(e);
    

    if(!found){
      let obj = e.option.value;
      obj.pivot = { 
        add_on_price:  0
      }
      this.selectedMeal.addons.push(obj);
    }

    this.addonsAutoComplete.setValue('');
  }

  fetchMeal(){
    if(!this.meal_id){

      this.selectedMeal = new Meal();
      this.selectedMeal.meal_category_id = this.meal_category_id;
      this.imageSrc = '/assets/images/snack.png';
      this.imageFile = null;


      for (const key in this.mealForm.controls) {
        if (this.mealForm.controls.hasOwnProperty(key)) {
          this.mealForm.controls[key].setValue( '' )
        }
      }

      this.mealForm.controls.meal_category_id.setValue(this.meal_category_id);

      this.selectedMeal.inventory_items = [];
      this.selectedMeal.addons = [];

      return;
    }


    this.isFetchingMeal = true;
    this.mealService.read(this.meal_id).subscribe(
      meal => {
        this.selectedMeal = meal;
        this.isFetchingMeal = false;


        this.imageSrc = meal.id ? meal.image_path_url : '/assets/images/snack.png';
        this.imageFile = null;

        for (const key in this.mealForm.controls) {
          if (this.mealForm.controls.hasOwnProperty(key)) {
            this.mealForm.controls[key].setValue( meal[key] )
          }
        }

        if(this.selectedMeal.inventory_items)
          this.selectedMeal.inventory_items.forEach( item => {
            item.item_count = item.pivot.item_count;
          });
        else
          this.selectedMeal.inventory_items = [];


        if(this.selectedMeal.addons)
          this.selectedMeal.addons.forEach( item => {
            item.pivot.add_on_price = item.pivot.add_on_price;
          });
        else
          this.selectedMeal.addons = [];

      }
    )
  }



  openBrowseFile(event: any) {
    event.preventDefault();
    const element = document.getElementById('image_pic') as HTMLElement;
    element.click();
  }

  onFileChange(event: any) {
    const files: any[] = event.target.files;
    if (files.length > 0) {
      this.imageFile = files[0];

      const reader = new FileReader();

      reader.addEventListener('load', (event: any) => {
        this.imageSrc  = event.target.result;
      });

      reader.readAsDataURL(this.imageFile);

    } else {
      this.resetImage();
    }
  }

  resetImage(): void{
    this.imageFile = null;
    if(!this.selectedMeal.id)
      this.imageSrc  = '/assets/images/snack.png';
    else
      this.imageSrc = this.selectedMeal.image_path_url;
  }



  saveMeal(): void{

    let form: FormData = new FormData();

    for (const key in this.mealForm.controls) {
      if (this.mealForm.controls.hasOwnProperty(key)) {
        const element = this.mealForm.controls[key];
        form.append(key, element.value);
      }
    }


    form.append('inventory_items', JSON.stringify(this.selectedMeal.inventory_items));
    form.append('addons', JSON.stringify(this.selectedMeal.addons));

    if(this.imageFile)
      form.append('image', this.imageFile);

    const request: Observable<any> = this.meal_id ? this.mealService.save(form) : this.mealService.create(form);

    request.subscribe(
          data => {
            this.activeModal.close();
            this.callback();
          },
          failure => {
            for (const key in failure.error.errors) {
              if (this.mealForm.controls.hasOwnProperty(key)) {
                this.mealForm.controls[key].setErrors(failure.error.errors[key]);
              }
            }

            console.log(this.mealForm.controls.name.invalid);
          }
    );

  }





  closeModal(): void{
    this.activeModal.dismiss('Closed');
  }

}
