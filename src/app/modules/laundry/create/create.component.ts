import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LaundryService } from '../../../services/laundry';
import { ConfigurationService } from '../../../services/configurations';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { CustomerService } from '../../../services/customer';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { startWith, debounceTime, switchMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InventoryItemService } from 'app/services/inventory_item';
import { WebcamImage } from 'ngx-webcam';
import { User } from 'app/services/user';
import { AuthenticationService } from 'app/core/auth.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class LaundryCreateComponent implements OnInit {
  selectedArea: any = {};
  addon_count = '';
  inventoryItems: any [] = [];
  add_on_search = '';
  _hh: number;
  _today: Date;
  _washing_machine: any = null;
  _drying_machine: any = null;

  _pickup_date: Date;
  _date_received: Date;
  _due_date: Date;
  _delivery_date: Date;



  private images: WebcamImage[] = [];
  private trigger: Subject<void> = new Subject<void>();

  laundry: any = {
    wash_type: null,
    transaction_type: null,

    new_customer_id: null,
    customer_id: null,
    customer_code: null,
    customer_name: null,
    customer_address: null,
    customer_contact_number: null,
    customer_area_id: null,

    date_received: null,
    due_date: null,

    pickup_date_from: null,
    pickup_date_to: null,

    regular_kg: '',
    regular_pieces: '',
    regular_rate: 0,

    beddings_kg: '',
    beddings_pieces: '',
    beddings_rate: 0,

    with_voucher: false,
    for_delivery: false,


    washing_machine_id: null,
    drying_machine_id: null,

    free_wifi_voucher: 0,
    free_wifi_claimed: false,

    charges: [],
    wash_charge: 0,
    total: 0,

    total_weight: 0,

  };

  saving = false;

  wash_types: any = [];
  transaction_types: any = [];
  areas: any = [];

  // price: any = {
  //   regular: 0,
  //   beddings: 0
  // };

  config: any = {};

  customers$: Observable<any> = null;
  autoComplete: FormControl;

  selectedCustomer: any = null;

  available_charges: any = {};

  current_user: User;

  constructor(private customerService: CustomerService,
              private configurationService: ConfigurationService,
              private laundryService: LaundryService,
              private inventoryService: InventoryItemService,
              private http: HttpClient,
              private router: Router,
              private toastr: ToastrService,
              authenticationService: AuthenticationService,
              private modalService: NgbModal) {

    this.current_user = authenticationService.getCurrentUser();

    this.autoComplete = new FormControl();

    this.http.get(`${environment.apiUrl}/laundries?config=1`).subscribe(
      (data: any) => {

        for (const key in data.wash_types) {
          if (data.wash_types.hasOwnProperty(key)) {
            const name = data.wash_types[key];
            this.wash_types.push({value: key, name: name})
          }
        }


        for (const key in data.transaction_types) {
          if (data.transaction_types.hasOwnProperty(key)) {
            const name = data.transaction_types[key];
            this.transaction_types.push({value: key, name: name})
          }
        }

        this.areas = data.areas;

        this.config = data.config;
        this._today = moment(this.config.today, 'YYYY-MM-DD').toDate();
        this._hh = Number(moment(this.config.today, 'YYYY-MM-DD').format('H'));

        this.available_charges = data.available_charges;
      }
    );


  }

  ngOnInit() {
    this.customers$ = this.autoComplete.valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(300),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value !== '' && typeof value === typeof '') {
          // lookup from github
          return this.lookup(value);
        } else {
          // if no value is present, return null
          return of(null);
        }
      }
    ));
  }

  lookup(value: string): Observable<any> {
    return this.customerService.query({
      params: {
        name: value
      }
    });
  }

  selectCustomer(e: MatAutocompleteSelectedEvent){
    const customer =  JSON.parse(JSON.stringify(e.option.value));
    this.selectedCustomer = customer;

    // setTimeout(() => {
      this.laundry.customer_id = customer.id;
      this.laundry.customer_code = customer.code;
    // }, 500);

    const address = document.getElementById('address') as HTMLElement;
    address.focus();

    this.laundry.customer_name = customer.name;
    this.laundry.customer_nickname = customer.nickname;
    this.laundry.customer_address = customer.address;
    this.laundry.customer_area_id = customer.area_id;
    this.setArea(customer.area_id);
    this.laundry.customer_building_id = customer.building_id;
    this.laundry.customer_contact_number = customer.contact_number;

  }


  displayFn(customer?: any): string | undefined {
    return customer ? customer.name : undefined;
  }

  checkCurrentCustomer(name: any) {
    if (name !== this.laundry.customer_name){
      this.laundry.customer_id = null;
      this.laundry.customer_code = null;
      this.laundry.customer_name = null;
    }
  }

  clearName() {
    this.autoComplete.setValue('');
    this.laundry.customer_id = null;
    this.laundry.customer_code = null;
    this.laundry.customer_name = null;
    this.laundry.customer_address = null;
    this.laundry.customer_nickname = null;
    this.laundry.customer_area_id = null;
    this.laundry.customer_contact_number = null;
  }

  transactionTypeChanged() {
    if (moment(this.config.today).get('hour') > 20 ) {
      this._pickup_date = moment(this._today).add(1, 'day').toDate();
      this.laundry._pickup_time_from = 18;
      this.laundry._pickup_time_to = 20;
    } else {
      this._pickup_date = moment(this._today).toDate();
      this.laundry._pickup_time_from = 18; // moment(this.config.today).format('HH');
      this.laundry._pickup_time_to = 20; // moment(this.config.today).add(1, 'hour').format('HH');
    }
  }

  Number(n: any) {
    return Number(n);
  }

  washTypeChanged() {
    const laundry = this.laundry;

    laundry.free_wifi_voucher = 0;
    laundry.free_wifi_voucher_claimed = false;

    if (Number(laundry.transaction_type) === 2) {
      this._date_received = null; // moment(this._pickup_date).toDate();
      laundry.time_received = null; // moment(this._today).format('hh:mm A');
    } else {
      this._date_received = moment(this._today).toDate();
      laundry.time_received = moment(this.config.today).format('hh:mm A');
    }

    if ( Number(this.laundry.wash_type) !== 4) {
          laundry.due_time = 20;

          const hh = moment().get('hour');


          if (Number(this.laundry.wash_type) === 2 || (hh >= this.config.cutoff_time && Number(this.laundry.wash_type) !== 3)) {
            this._due_date = moment(this._today).add(2, 'days').toDate();
            laundry.min_due_time = 18;
            laundry.due_time = 20;
          } else if (Number(this.laundry.wash_type) === 3) {
            // RUSH
            this._due_date = moment(this._today).toDate();
            laundry.min_due_time = moment().get('hour') + 2;
            laundry.due_time = moment().get('hour') + 3;

            laundry.min_due_time =  laundry.min_due_time > 19 ? 19 : laundry.min_due_time;
            laundry.due_time =  laundry.due_time > 20 ? 20 : laundry.due_time;
          } else {
            this._due_date = moment(this._today).add(1, 'days').toDate();
            laundry.min_due_time = 18;
            laundry.due_time = 20;
          }

          this.laundry.regular_rate = 0;
          this.laundry.beddings_rate = 0;
          this.configurationService.query({
            params: {
              wash_type: laundry.wash_type
            }
          }).subscribe(
            data => {
              const price = this.configurationService.getMeta();
              this.laundry.regular_rate = price.regular_rate;
              this.laundry.beddings_rate = price.beddings_rate;
              this.computeCharges();
            }
          );

    } else {
          laundry.free_wifi_voucher = 1;
          //laundry.free_wifi_voucher_claimed = true;

          this._due_date = moment(this._today).toDate();
          laundry.min_due_time = moment().get('hour') + 2;
          laundry.due_time = moment().get('hour') + 3;

          // laundry.transaction_type = '1';
          laundry.regular_ks = 0;
          laundry.beddings_kg = 0;
          this.computeCharges();


          // this.inventoryService.query({
          //   params: {
          //     category: 'laundry'
          //   }
          // }).subscribe(
          //   data => {
          //     this.inventoryItems = data;
          //     this.saving = false;
          //   }
          // )
          this.fetchLaundryAddOns();
    }


    this.computeCharges();
  }

  minimumBaseCharge() {
    return this.laundry.regular_rate * 3;
  }

  getTotalWeight() {
    const weight = Number(this.laundry.regular_kg) + Number(this.laundry.beddings_kg);
    this.laundry.total_weight = Number(this.laundry.wash_type) !== 4 ? weight : 0;
    return this.laundry.total_weight;
  }

  computeCharges() {
    const laundry = this.laundry;
    const config = this.config;

    laundry.total = 0;
    laundry.wash_charge = 0;

    laundry.charges = [];

    if ( this.getTotalWeight() <= 0 && Number(laundry.wash_type) !== 4) {
      laundry.total = 0;
    } else {

          if (Number(laundry.wash_type) === 4 && this._washing_machine !== null) {
            laundry.washing_machine_id = this._washing_machine.id;
            laundry.charges.push( {
                                    description: this.available_charges.WASHING_MACHINE_CHARGE,
                                    name: 'Washing Machine Charge',
                                    amount: Number(this._washing_machine.default_self_service_fee),
                                  });
          }

          if (Number(laundry.wash_type) === 4 && this._drying_machine !== null) {
            laundry.drying_machine_id = this._drying_machine.id;
            laundry.charges.push( {
                                    description: this.available_charges.DRYING_MACHINE_CHARGE,
                                    name: 'Dryer Machine Charge',
                                    amount: Number(this._drying_machine.default_self_service_fee)
                                  });
          }


          if (Number(laundry.wash_type) === 4 && this._drying_machine && !this._washing_machine) {
                laundry.charges.push( {
                                        description: this.available_charges.SPIN_CHARGE,
                                        name: 'Spin Charge',
                                        amount: config.spin_charge
                                      });
          }

          if (Number(laundry.wash_type) !== 4) {

              let base_charge =  ((laundry.beddings_kg * this.laundry.beddings_rate) +
                                (laundry.regular_kg * this.laundry.regular_rate) );

              base_charge = (base_charge > this.minimumBaseCharge()) ? base_charge : this.minimumBaseCharge();


              if (base_charge > Math.floor(base_charge)) {
                base_charge = Math.floor(base_charge) + 1;
              }

              laundry.free_wifi_voucher = Math.floor(this.getTotalWeight() / config.no_of_kilo_for_free_wifi_voucher);

              if (laundry.free_wifi_voucher <= 0) {
                laundry.free_wifi_claimed = false;
              }

              // if(laundry.free_wifi_claimed) {
              //     laundry.charges.push( {
              //       description: this.available_charges.FREE_WIFI,
              //       name: laundry.free_wifi_voucher + ' Wifi Voucher Claimed',
              //       amount: 0
              //     });
              // }

              laundry.charges.push( {
                                      description: this.available_charges.BASE_CHARGE,
                                      name: 'Base Charge',
                                      amount: base_charge
                                    });
          }

    }


    laundry.charges.forEach((charge: any) => {
      laundry.wash_charge += charge.amount;
    });



    if (Number(laundry.transaction_type) === 2 && Number(laundry.wash_type !== 4)) {
          laundry.charges.push( {
                                  description: this.available_charges.PICKUP_CHARGE,
                                  name: 'Pickup Charge',
                                  amount: config.pickup_charge
                                });
    }

    if (laundry.for_delivery && this.getTotalWeight() < config.free_delivery_minimum_weight) {
          laundry.charges.push( {
                                  description: this.available_charges.DELIVERY_CHARGE,
                                  name: 'Delivery Charge',
                                  amount: config.delivery_charge
                                });
    } else if (laundry.for_delivery && this.getTotalWeight() >= config.free_delivery_minimum_weight) {
          laundry.charges.push( {
                                  description: this.available_charges.DELIVERY_CHARGE,
                                  name: 'Delivery Charge',
                                  amount: 0
                                });
    }


    if (laundry.with_voucher) {
          laundry.charges.push( {
                                  description: this.available_charges.VOUCHER_DISCOUNT,
                                  name: 'Voucher Discount',
                                  amount: config.voucher_discount * -1
                                });
    }

    if (laundry.free_wifi_claimed && laundry.free_wifi_voucher > 0) {
          laundry.charges.push( {
                                  description: this.available_charges.FREE_WIFI,
                                  name: laundry.free_wifi_voucher + ' Free Wifi Voucher',
                                  remarks: laundry.free_wifi_voucher,
                                  amount: 0
                                });
    }



    if (this.computeTotalAddOns() > 0 && laundry.wash_type == 4) {
          laundry.add_ons = [];
          laundry.charges.push( {
                                  description: this.available_charges.ADDON_CHARGE,
                                  name: 'Add Ons',
                                  amount: this.computeTotalAddOns()
                                });

          this.inventoryItems.forEach(item => {
            const c = Number(item.add_on_count);

            if(c > 0 && c <= item.no_of_stocks) {
              laundry.add_ons.push({
                inventory_item_id: item.id,
                price: Number(item.price),
                quantity: c,
                total_amount: c * item.price
              });
            }
          });
    }

    laundry.charges.forEach( (charge: any) => {
          laundry.total += charge.amount;
    });


    if (laundry.total > Math.floor(laundry.total)) {
      laundry.total = Math.floor(laundry.total) + 1;
    }

    return laundry.charges;

  }

  deliveryChanges() {
    this.computeCharges();
    if (this.laundry.for_delivery) {
      // setTimeout(() => {
      //   const e = (document.getElementById('del_dp_trigger') as HTMLElement).firstElementChild as HTMLElement;
      //   if (e) {
      //     e.click();
      //   }
      // }, 200);
      // this._delivery_date = this._due_date;
      // this.laundry._delivery_time_from = this.laundry.due_time - 1;
      // this.laundry._delivery_time_to = this.laundry.due_time;
    }
  }

  saveTransaction(){
    if (this.saving) {
      return;
    }
    this.saving = true;
    const laundry = this.laundry;

    if (!laundry.customer_id) {
      laundry.customer_name = this.autoComplete.value;
      laundry.customer_code = null;
    }

    if (this._pickup_date && laundry._pickup_time_from) {
      laundry.pickup_date_from = moment(this._pickup_date).format('YYYY-MM-DD') + ' ' +
                                (laundry._pickup_time_from > 9 ? laundry._pickup_time_from : ('0' + laundry._pickup_time_from) ) + ':00:00';
      if (laundry._pickup_time_to) {
        laundry.pickup_date_to = moment(this._pickup_date).format('YYYY-MM-DD') + ' ' + laundry._pickup_time_to + ':00:00';
      }
    }

    if (this._date_received) {
      laundry.date_received = moment(this._date_received).format('YYYY-MM-DD');
    }

    if (this._due_date) {
      laundry.min_due_date = moment(this._due_date).format('YYYY-MM-DD') + ' ' + laundry.min_due_time + ':00:00';
      laundry.due_date = moment(this._due_date).format('YYYY-MM-DD') + ' ' + laundry.due_time + ':00:00';
    }

    laundry.base64Images = [];
    this.images.forEach( (image:WebcamImage) => {
      laundry.base64Images.push(image.imageAsBase64);
    });

    this.laundryService.create(laundry).subscribe(
      _laundry => {
        if (_laundry.date_received) {
          this.router.navigate([`/laundry/${ _laundry.id }`]);
        } else {
          this.router.navigate([`/laundry`]);
        }
        this.toastr.success('Transaction saved!');
        this.saving = false;
      },
      fail => {
        const e = fail.error.errors;
        let err = '';
        for (const key in e) {
          if (e.hasOwnProperty(key)) {
            const element = e[key];
            err += key + ': ' + element[0] + '\n';
            break;
          }
        }
        this.toastr.error(err, 'Error');
        this.saving = false;
      }
    );
  }

  getTimeTo(t: any, max: any = 21) {
    const t2 = [];
    for (let n = t + 1; n < max; n++) {
      t2.push(n);
    }
    return t2;
  }

  showAddOnModal(modal: NgbModalRef) {
    this.fetchInventoryItems();
    this.modalService.open(modal, { backdrop: 'static', size: 'sm'});
  }


  fetchInventoryItems(): void {
    this.inventoryService.query({
      params: {
        category: 'laundry'
      }
    }).subscribe(
      data => {
        this.inventoryItems = data;
        this.saving = false;
      }
    )
}


  fetchLaundryAddOns() {
    if (this.saving) {
      return;
    }

    this.saving = true;
    this.inventoryService.query({
      params: {
        category: 'laundry'
      }
    }).subscribe(
      data => {
        this.inventoryItems = data;
        this.inventoryItems.forEach(item => {
          item.add_on_count = '';
        });
        this.saving = false;
      }
    )
  }

  computeTotalAddOns(): number {
    let total = 0;

    this.inventoryItems.forEach(item => {
      const c = Number(item.add_on_count);
      if(c > 0 && c <= item.no_of_stocks) {
        total += c * item.price;
      }
    });
    return total;
  }


  setArea(area_id: any){
    this.areas.forEach(area => {
      if(area.id == area_id)
        this.selectedArea = area;
    });
    this.laundry.customer_building_id = null;
  }


  showAddPhotoModal(modal: NgbModalRef){
    this.modalService.open(modal, { backdrop: 'static', size: 'lg'});
  }


  public triggerSnapshot(): void {
    this.trigger.next();
  }


  public handleImage(webcamImage: WebcamImage): void {
    console.log('received webcam image', webcamImage);
    this.images.push(webcamImage);
    // this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }


  public setRate(type: string){
    if(!this.current_user.is_administrator){
      return;
    }


    const new_rate = Number(prompt(`Enter custom rate for ${type == 'regular_rate' ? 'regular items' : 'beddings' }:`, this.laundry[type]));
    if(new_rate && new_rate > 0){
      this.laundry[type] = new_rate;
      this.computeCharges();
    }
  }

}
