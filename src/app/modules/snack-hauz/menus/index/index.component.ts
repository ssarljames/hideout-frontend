import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Component, OnInit } from '@angular/core';
import { MealCategoryService } from 'app/services/meal_category';
import { fetchAnimation } from 'app/animations/animations';
import { MealService } from 'app/services/meal';
import { ToastrService } from 'ngx-toastr';
import { startWith, debounceTime, switchMap } from 'rxjs/operators';
import { InventoryItemService } from 'app/services/inventory_item';
import { MealCategory } from 'app/models/meal-category/meal-category';
import { Meal } from 'app/models/meal/meal';
import { MealFormModalComponent } from '../modals/meal-form-modal/meal-form-modal.component';
import { ModalService } from 'app/shared/services/modal/modal.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [fetchAnimation]
})
export class MenusIndexComponent implements OnInit {

  isFetching: boolean = false;

  queryParams = {
    q: '',
    per_page : 15,
    page: 1,
    sort_active: 'name',
    sort_direction: 'asc'
  }

  meal_categories: MealCategory[];
  meals: {};

  dirtyItems: any = {};
  dirtyItemsCount: number = 0;

  // mealForm: FormGroup;

  // imageFile: any;
  // imageSrc: string;

  // autoComplete: FormControl;
  // inventoryItems$: Observable<any> = null;

  // selectedMeal: Meal;

  openedCategories: string[] = [];

  constructor(private mealCategoryService: MealCategoryService,
              private mealService: MealService,
              private inventoryItemService: InventoryItemService,
              private toastr: ToastrService,
              private http: HttpClient,
              private ngbModal: NgbModal,
              private modalService: ModalService) {

                // this.autoComplete = new FormControl();


                // this.mealForm = new FormGroup({
                //   id: new FormControl(),
                //   name: new FormControl(),
                //   description: new FormControl(),
                //   price: new FormControl(),
                //   meal_category_id: new FormControl(),
                // });


               }

  ngOnInit() {
    this.fetchMealCategories();
  }

  fetchMealCategories(e: KeyboardEvent = null) :void{

    this.dirtyItems = {};
    this.dirtyItemsCount = 0;
    this.isFetching = true;

    this.mealCategoryService.query({
      params: this.queryParams
    }).subscribe(
      data => {

        this.meals = {};

        data.forEach( mc => {
          mc.hide = this.openedCategories.findIndex( id => mc.id == id) == -1;
          mc.meals.forEach( (meal: any) => {
            this.meals[meal.id] = JSON.parse(JSON.stringify(meal));
            this.meals[meal.id].available = (meal.available == 1);
          })
        })


        this.meal_categories = data;
        this.isFetching = false;



      },
      () => {
        this.isFetching = false;
      }
    )
  }

  toggleMealCategoryView(meal_category: any): void{
    meal_category.hide = !meal_category.hide;

    if(meal_category.hide)
      this.openedCategories = this.openedCategories.filter( id => id != meal_category.id);
    else
      this.openedCategories.push(meal_category.id);

    console.log(this.openedCategories);
    
  }

  availabilityOfMealCategoryChange(e: MatCheckboxChange = null): void{
    this.meal_categories.forEach( mc => {
      if(mc.id == e.source.value){
          mc.available = e.checked;
          mc.available_meal_count = e.checked ?  mc.meals.length : 0;
          mc.meals.forEach( (meal: any) => {
            meal.available = e.checked;
            if(this.meals[meal.id].available != meal.available )
              this.dirtyItems[meal.id] = e.checked;
            else
              delete this.dirtyItems[meal.id];
          });
      }
    });





    this.dirtyItemsCount = Object.keys(this.dirtyItems).length;
  }

  availabilityOfMealChange(e: MatCheckboxChange = null): void{
    if(this.meals[e.source.value].available != e.checked ){
      this.dirtyItems[e.source.value] = e.checked;
    }else
      delete this.dirtyItems[e.source.value];

    this.meal_categories.forEach( mc => {
      if(mc.id == this.meals[e.source.value].meal_category_id){
          let checked = 0;
          let unchecked = 0;
          mc.meals.forEach( (meal: any) => {

            if(meal.id == e.source.value)
              meal.available = e.checked;

            checked += meal.available ? 1 : 0;
            unchecked += meal.available ? 0 : 1;


          });

          mc.is_indeterminate = unchecked > 0 && checked > 0;
          mc.available = (unchecked == 0);
          mc.available_meal_count = checked;
      }
    });

    this.dirtyItemsCount = Object.keys(this.dirtyItems).length;
  }



  openMealForm(mealFormModal: NgbModalRef, meal: any): void{

        const modal: NgbModalRef = this.ngbModal.open(MealFormModalComponent, {size: 'lg', backdrop: 'static'});
        modal.componentInstance.meal_id = meal.id;
        modal.componentInstance.meal_category_id = meal.meal_category_id;
        modal.componentInstance.callback = () => {
            this.toastr.success("Meal information was saved!");
            this.fetchMealCategories();
        }
  }

  saveMealAvailabilityChanges(): void{

    this.mealService.updateMealAvailability(this.dirtyItems).subscribe(
      data => {
        this.toastr.success(`Changes saved on ${ this.dirtyItemsCount } item${ this.dirtyItemsCount > 1 ? 's' : ''}.`);
        this.fetchMealCategories();
      }
    );

  }

  renameCategory(meal_category: any): void{
    // const name = prompt("Enter new category name", meal_category.name);

    this.modalService.prompt({
      message: 'Enter category name',
      value: meal_category.name
    }).then( name => {


      if(name){

        this.modalService.confirm({}).then( () => {

              this.mealCategoryService.save({
                id: meal_category.id,
                name: name
              }).subscribe(
                data => {
                  this.toastr.success("category has been updated!");
                  this.fetchMealCategories();
                }
              )
        })
  
      }
    });
    
  }
  
  newCategory(): void{
    this.modalService.prompt({
      message: 'Category name',
    }).then( name => {

      if(name)

        this.mealCategoryService.create({
          name: name
        }).subscribe(
          data => {
            this.toastr.success("category has been created!");
            this.fetchMealCategories();
          },

          e => {
            this.toastr.error('Saving failed.');
          }
        )
    })
  }

}
