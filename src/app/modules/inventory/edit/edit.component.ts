import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../services/category';
import { InventoryItemService } from '../../../services/inventory_item';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class InventoryItemEditComponent implements OnInit {
  form: FormGroup;

  categories: any[] = [];
  item: any = null;
  isFetching = false;

  constructor(private inventoryItemService: InventoryItemService,
              private categoryService: CategoryService,
              private toastr: ToastrService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

  }
  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.isFetching = true;
    this.inventoryItemService.read(id).subscribe(
      data => {
        this.item = data;
        this.isFetching = false;


        this.form = new FormGroup({
          name: new FormControl( data.name, Validators.required),
          price: new FormControl(data.price, Validators.required),
          item_category_id: new FormControl(data.item_category_id, Validators.required),
          warn_stock: new FormControl(data.warn_stock, Validators.required),
        });


      }
    );

    this.categoryService.query().subscribe(
      data => {
        this.categories = data;
      }
    );
  }


  saveItem() {
    if (this.form.invalid) {
      return;
    }
    this.inventoryItemService.update({
      id: this.item.id,
      name: this.form.controls.name.value,
      price: this.form.controls.price.value,
      item_category_id: this.form.controls.item_category_id.value,
      warn_stock: this.form.controls.warn_stock.value,
    }).subscribe(
      data => {
        this.toastr.success('Item was updated successfully');
        this.router.navigate(['/inventory']);
      },
      failed => {
        for (const key in failed.error.errors){
          if (this.form.controls[key]) {
            this.form.controls[key].setErrors(failed.error.errors[key]);
          }
        }
      }
    )
  }

  log($event){
    console.log($event)
  }

}
