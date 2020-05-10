import { ModalService } from 'app/shared/services/modal/modal.service';
import { AuthenticationService } from 'app/core/auth.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LaundryService } from '../../../services/laundry';
import { ConfigurationService } from '../../../services/configurations';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { CustomerService } from '../../../services/customer';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage } from 'ngx-webcam';
import { InventoryItemService } from 'app/services/inventory_item';
import { User } from 'app/services/user';

@Component({
  selector: 'app-create',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class LaundryEditComponent implements OnInit {
  selectedArea: any = {};
  inventoryItems: any [] = [];
  capture: Observable<void>;
  saving = false;
  _hh: number;
  _today: Date;
  _washing_machine: any = null;
  _drying_machine: any = null;

  _pickup_date: Date;
  _date_received: Date;
  _due_date: Date;
  _delivery_date: Date;

  laundry: any = {
    id: null,
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

  laundry_id: string;

  private images: WebcamImage[] = [];
  private trigger: Subject<void> = new Subject<void>();


  current_user: User;

  constructor(private customerService: CustomerService,
              private configurationService: ConfigurationService,
              private laundryService: LaundryService,
              private inventoryService: InventoryItemService,
              private http: HttpClient,
              private router: Router,
              private toastr: ToastrService,
              private activatedRoute: ActivatedRoute,
              authenticationService: AuthenticationService,
              private modalService: NgbModal,
              private modalUtils: ModalService) {

    this.current_user = authenticationService.getCurrentUser();

    this.capture = new Observable<void>();
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
        const prv_bldg_id = this.laundry.customer_building_id;
        this.setArea(this.laundry.customer_area_id);
        this.laundry.customer_building_id = prv_bldg_id;

        this.config = data.config;
        this._today = moment(this.config.today, 'YYYY-MM-DD').toDate();
        this._hh = Number(moment(this.config.today, 'YYYY-MM-DD').format('H'));

        this.available_charges = data.available_charges;
      }
    );


  }

  getMachine(id: any) {
    let m = null;
    this.config.washing_machines.forEach(element => {
      if (Number(id) === Number(element.id)) {
        m = element;
      }
    });
    this.config.dryers.forEach(element => {
      if (Number(id) === Number(element.id)) {
        m = element;
      }
    });
    return m;
  }

  ngOnInit() {
    this.laundry_id = this.activatedRoute.snapshot.params['id'];
    this.laundry = {};
    this.laundryService.read(this.laundry_id).subscribe(
      laundry => {
        if (!laundry.is_editable) {
          this.toastr.error('Oops! You don\'t have the right to edit this transaction.');
          this.router.navigate(['laundry/' + laundry.id]);
        }


        this.setArea(laundry.customer_area_id);


        for (const key in laundry) {
          if (laundry.hasOwnProperty(key)) {
            this.laundry[key] = laundry[key];
          }
        }

        this.laundry.transaction_type = laundry.transaction_type + '';

        if (this.laundry.wash_type) {
          this.laundry.wash_type = laundry.wash_type + '';
        }
        this._washing_machine = laundry.washing_machine_id;
        this._drying_machine = laundry.drying_machine_id;

        this.laundry.add_ons = [];


        setTimeout(() => {
          // this.washTypeChanged();

          if(this.laundry.addon_remarks && this.laundry.wash_type == 4) {
              const addon_remarks_json = JSON.parse(laundry.addon_remarks);
              this.inventoryService.query({
                params: {
                  category: 'laundry'
                }
              }).subscribe(
                data => {
                  this.inventoryItems = data;
                  this.inventoryItems.forEach(item => {
                    item.add_on_count = 0;
                    addon_remarks_json.forEach( item2 => {
                        if(item.id == item2.item_id){
                          item['add_on_count'] = item2.count;
                        }
                    });
                  });

                  this.computeCharges();
                }
              )
          }

          this.computeCharges();

          this._pickup_date = moment(laundry.pickup_date_from).toDate();
          this.laundry._pickup_time_from = moment(laundry.pickup_date_from).get('hour');
          this.laundry._pickup_time_to = moment(laundry.pickup_date_to).get('hour');

          this._date_received = moment(laundry.date_received).toDate();
          console.log(this._date_received);

          if (this._date_received) {
            this.laundry.time_received = moment(laundry.date_received).format('h:m a');

            this._due_date = moment(laundry.due_date).toDate();

            this.laundry.min_due_time = moment(laundry.min_due_date).get('hour');
            this.laundry.due_time = moment(laundry.due_date).get('hour');
          }

        }, 500);

      }
    );
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
  }

  transactionTypeChanged() {
    if (moment(this.config.today).get('hour') > 17 ) {
      this._pickup_date = moment(this._today).add(1, 'day').toDate();
      this.laundry._pickup_time_from = 9;
      this.laundry._pickup_time_to = 10;
    } else {
      this._pickup_date = moment(this._today).toDate();
      this.laundry._pickup_time_from = moment(this.config.today).format('HH');
      this.laundry._pickup_time_to = moment(this.config.today).add(1, 'hour').format('HH');
    }
  }

  Number(n: any) {
    return Number(n);
  }

  washTypeChanged() {
    const laundry = this.laundry;

    laundry.free_wifi_voucher = 0;
    laundry.free_wifi_voucher_claimed = false;

    this._date_received = moment(this._today).toDate();
    laundry.time_received = moment(this.config.today).format('hh:mm A');

    if ( Number(this.laundry.wash_type) !== 4) {
          laundry.due_time = 20;

          const hh = moment().get('hour');


          if (Number(this.laundry.wash_type) === 2 || (hh >= this.config.cutoff_time && Number(this.laundry.wash_type) !== 3)) {
            this._due_date = moment(this._today).add(2, 'days').toDate();
            laundry.min_due_time = 19;
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
            laundry.min_due_time = 19;
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
          laundry.free_wifi_voucher_claimed = true;
          // laundry.due_date = '';
          // laundry.transaction_type = '1';
          laundry.regular_ks = 0;
          laundry.beddings_kg = 0;
          this.computeCharges();

          this.fetchInventoryItems();

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
            laundry.washing_machine_id = this._washing_machine;
            laundry.charges.push( {
                                    description: this.available_charges.WASHING_MACHINE_CHARGE,
                                    name: 'Washing Machine Charge',
                                    amount: Number( this.getMachine(this._washing_machine).default_self_service_fee),
                                  });
          }

          if (Number(laundry.wash_type) === 4 && this._drying_machine !== null) {
            laundry.drying_machine_id = this._drying_machine;
            laundry.charges.push( {
                                    description: this.available_charges.DRYING_MACHINE_CHARGE,
                                    name: 'Dryer Machine Charge',
                                    amount: Number(this.getMachine(this._drying_machine).default_self_service_fee)
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

    if (laundry.pickup_times) {
      laundry.charges.push( {
                              description: this.available_charges.REPICKUP_CHARGE,
                              name: `Pickup Charge (${laundry.pickup_times} attempt${laundry.pickup_times > 1 ? 's' : ''})`,
                              amount: this.config.pickup_charge * Number(laundry.pickup_times)
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
                                  (laundry._pickup_time_from > 9 ? laundry._pickup_time_from : ('0' + laundry._pickup_time_from) )
                                   + ':00:00';
      if (laundry._pickup_time_to) {
        laundry.pickup_date_to = moment(this._pickup_date).format('YYYY-MM-DD') + ' ' + laundry._pickup_time_to + ':00:00';
      }
    }

    // if (this._date_received) {
    //   laundry.date_received = moment(this._date_received).format('YYYY-MM-DD');
    // }

    if (this._due_date) {
      laundry.min_due_date = moment(this._due_date).format('YYYY-MM-DD') + ' ' + laundry.min_due_time + ':00:00';
      laundry.due_date = moment(this._due_date).format('YYYY-MM-DD') + ' ' + laundry.due_time + ':00:00';
    }


    laundry.base64Images = [];
    this.images.forEach( (image:WebcamImage) => {
      laundry.base64Images.push(image.imageAsBase64);
    });

    this.laundryService.update(laundry).subscribe(
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

  deleteTransaction() {
    // if (!confirm('Are you sure to delete this transaction?')) {
    //   return;
    // }


    // const num = Math.round(Math.random() * 10) + 2;
    // const num2 = Math.round(Math.random() * 10) + 2;
    // const ans = prompt(`Please answer the question to proceed.\n\n${num} x ${num2} = ?`);
    // if (Number(ans) !== (num * num2)) {
    //   return;
    // }

    this.modalUtils.confirm({
      message: 'Are you sure to delete this transaction?',
      type: 'danger',
      withPrompt: true
    }).then(
      () => {
          this.laundryService.delete(this.laundry_id).subscribe(
            data => {
              this.toastr.success('Transaction was deleted sucessfully.');
              this.router.navigate(['/laundry']);
            }
          );
      },
      () => {

      }
    )
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



  showAddOnModal(modal: NgbModalRef) {
    this.fetchInventoryItems();
    this.modalService.open(modal, { backdrop: 'static', size: 'sm'});
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


}
