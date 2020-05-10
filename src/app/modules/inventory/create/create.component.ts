import { CategoryService } from '../../../services/category';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InventoryItemService } from 'app/services/inventory_item';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class InventoryCreateComponent implements OnInit {
  form: FormGroup;

  categories: any[] = [];

  constructor(private inventoryItemService: InventoryItemService,
              private categoryService: CategoryService,
              private toastr: ToastrService,
              private router: Router) {


    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      item_category_id: new FormControl('', Validators.required),
      warn_stock: new FormControl('', Validators.required),
    });

    this.categoryService.query().subscribe(
      data => {
        this.categories = data;
      }
    )


  }

  ngOnInit() {
  }

  saveItem() {
    if (this.form.invalid) {
      return;
    }
    this.inventoryItemService.create({
      name: this.form.controls.name.value,
      price: this.form.controls.price.value,
      item_category_id: this.form.controls.item_category_id.value,
      warn_stock: this.form.controls.warn_stock.value,
    }).subscribe(
      data => {
        this.toastr.success('New item was added');
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
