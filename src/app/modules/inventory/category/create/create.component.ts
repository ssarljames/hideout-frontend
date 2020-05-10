import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services/category';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class InventoryCategoryCreateComponent implements OnInit {

  form:FormGroup = null;

  constructor(private categoryService: CategoryService,
              private router: Router,
              private toastr: ToastrService) {
    this.form = new FormGroup({
      name:new FormControl('', Validators.required )
    })
   }

  ngOnInit() {
  }

  saveCategory(){
    if(this.form.invalid)
      return;

    this.categoryService.create({
      name: this.form.controls.name.value
    }).subscribe(
      data => {
        this.toastr.success("New category saved");
        this.router.navigate(['/inventory/categories']);
      },
      failure => {

        for (let key in failure.error.errors)
          if(this.form.controls[key])
            this.form.controls[key].setErrors(failure.error.errors[key]);

      }
    )
  }



}
