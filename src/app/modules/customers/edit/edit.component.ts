import { BuildingService } from '../../../services/building';
import { AreaService } from '../../../services/area';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../services/customer';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class CustomerEditComponent implements OnInit {
  selectedArea: any = {};
  form: FormGroup = null;
  customer: any;
  customer_id: any;
  areas: any[] = [];
  buildings: any[] = [];
  constructor(private customerService: CustomerService,
              private router: Router,
              private route: ActivatedRoute,
              private areaService: AreaService) {
    this.areaService.query().subscribe(
      data => {
        this.areas = data;
      }
    );
  }

  ngOnInit() {
    this.customer_id = Number(this.route.snapshot.params['id']);
    this.fetchCustomer();
  }

  fetchCustomer(){
    this.customerService.read(this.customer_id).subscribe(
      data => {
        this.customer = data;
        const formControls = {
          code: new FormControl(data.code),
          name: new FormControl(data.name),
          nickname: new FormControl(data.nickname),
          address: new FormControl(data.address),
          building_id: new FormControl(data.building_id),
          area_id: new FormControl(data.area_id),
          contact_number: new FormControl(data.contact_number)
        };
        this.form = new FormGroup(formControls);
        this.customer = {};

        setTimeout( ()=>{
          this.setArea(data.area_id)
        }, 1000);
      }
    );
  }

  save() {
    for (const key in this.form.controls) {
      if (this.form.controls.hasOwnProperty(key)) {
        this.customer[key] = this.form.controls[key].value;
      }
    }
    this.customer.id = this.customer_id;
    this.customerService.update(this.customer).subscribe(
      data => {
        this.router.navigate(['/customers/' + this.customer_id]);
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
