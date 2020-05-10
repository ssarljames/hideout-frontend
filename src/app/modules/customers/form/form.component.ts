import { AreaService } from '../../../services/area';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerService } from 'app/services/customer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  form: FormGroup;
  customer: any;
  areas: any[] = [];
  selectedArea: any = {};
  constructor(private customerService: CustomerService,
              private router: Router,
              private areaService: AreaService) {
    const formControls = {
      code: new FormControl(),
      name: new FormControl(),
      nickname: new FormControl(),
      address: new FormControl(),
      area_id: new FormControl(),
      building_id: new FormControl(),
      contact_number: new FormControl()
    };

    this.form = new FormGroup(formControls);
    this.customer = {};
    this.areaService.query().subscribe(
      data => {
        this.areas = data;
      }
    );
  }

  ngOnInit() {
  }

  save() {
    for (const key in this.form.controls) {
      if (this.form.controls.hasOwnProperty(key)) {
        this.customer[key] = this.form.controls[key].value;
      }
    }

    this.customerService.create(this.customer).subscribe(
      data => {
        this.router.navigate(['customers']);
      },
      response => {

        for (const key in response.error.errors) {
          if (this.form.controls.hasOwnProperty(key)) {
            this.form.controls[key].setErrors(response.error.errors[key]);
          }
        }

      }
    )

  }

  setArea(area_id: any){
    this.areas.forEach(area => {
      if(area.id == area_id)
        this.selectedArea = area;
    });
  }

}
