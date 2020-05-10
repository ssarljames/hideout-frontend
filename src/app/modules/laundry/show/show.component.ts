import { AddPaymentService } from './../add-payment-modal/add-payment.service';
import { ComposeSmsService } from './../../sms/outbox/compose-modal/compose-modal.service';
import { ModalService } from 'app/shared/services/modal/modal.service';
import { Subject, Observable } from 'rxjs';
import { CustomerService } from 'app/services/customer';
import { EchoService } from 'angular-laravel-echo';
import { AuthenticationService } from 'app/core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LaundryService } from 'app/services/laundry';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { fetchAnimation } from 'app/animations/animations';
import { InventoryItemService } from 'app/services/inventory_item';
import { WebcamImage } from 'ngx-webcam';
import { AddActionModalService } from '../add-action-modal/add-action-modal.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
  animations: [fetchAnimation]
})
export class LaundryShowComponent implements OnInit, OnDestroy {
  selectedImage: any = {};
  inventoryItems: any[] = [];
  customer: any = {};
  currentUser: any = {};
  showAddAction = false;
  laundry: any = {};
  cash_received: number;

  payment_methods: any[] = [];


  laundry_id: number;

  saving = false;


  private images: WebcamImage[] = [];
  private trigger: Subject<void> = new Subject<void>();


  constructor(private activatedRoute: ActivatedRoute,
              private laundryService: LaundryService,
              authenticationService: AuthenticationService,
              private inventoryService: InventoryItemService,
              private customerService: CustomerService,
              config: NgbModalConfig, private modalService: NgbModal,
              private toastr: ToastrService,
              private echoService: EchoService,
              private modalUtils: ModalService,
              private composeSmsService: ComposeSmsService,
              private addActionService: AddActionModalService,
              private paymentService: AddPaymentService) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
    this.currentUser = authenticationService.getCurrentUser();
  }

  ngOnInit() {
    this.laundry_id = Number(this.activatedRoute.snapshot.params['id']);
    this.fetchLaundry();
    this.echoService.join(`laundries.${this.laundry_id}`, 'private');
    this.echoService.listen(`laundries.${this.laundry_id}`, 'LaundryActionCreated').subscribe(
      data => {
        console.log(data);
        if (data.laundry_action.laundry_id === this.laundry_id) {
          this.fetchLaundry();
        }
      }
    );
    this.echoService.listen(`laundries.${this.laundry_id}`, 'LaundryActionDeleted').subscribe(
      data => {
        console.log(data);
        if (data.laundry_action.laundry_id === this.laundry_id) {
          this.fetchLaundry();
        }
      }
    );
    this.echoService.listen(`laundries.${this.laundry_id}`, 'LaundryUpdated').subscribe(
      data => {
        this.fetchLaundry();
      }
    );
  }

  ngOnDestroy(): void {
    this.echoService.leave(`laundries.${this.laundry_id}`);
  }

  fetchLaundry() {
    this.laundryService.read(this.laundry_id).subscribe(
      data => {
        this.laundry = data;
        if(data.addon_remarks && data.wash_type == 4)
          this.laundry.addon_remarks_json = JSON.parse(data.addon_remarks);
      }
    );
  }

  openActionModal() {
    this.addActionService.show(this.laundry).then(
      () => {
        this.fetchLaundry();
      },
      () => {

      }
    )
  }

  deleteAction(action: any) {
    if (this.saving) {
      return;
    }
    // if ( !confirm('Are you sure to delete this action?')) {
    //   return;
    // }

    this.modalUtils.confirm({
      message: 'Are you sure to delete this action?'
    }).then(
      () => {
            this.saving = true;

            this.laundry.delete_action = action;

            this.laundryService.update(this.laundry).subscribe(
              data => {
                this.toastr.clear();
                this.toastr.success('Action deleted!');
                this.fetchLaundry();
                this.saving = false;
              }
            );
      },
      () => {

      }
    )

  }

  setPayment() {
    this.paymentService.show(this.laundry).then(
      () => {
        this.fetchLaundry();
      },
      () => {

      }
    );
  }

  deletePayment(payment){
    if (this.saving) {
      return;
    }
    this.saving = true;

    // if (!confirm('Are you sure to remove payment?')) {
    //   this.saving = false;
    //   return;
    // }

    // const num = Math.round(Math.random() * 10) + 2;
    // const num2 = Math.round(Math.random() * 10) + 2;
    // const ans = prompt(`Please answer the question to proceed.\n\n${num} x ${num2} = ?`);
    // if (Number(ans) !== (num * num2)) {
    //   this.saving = false;
    //   return;
    // }

    this.modalUtils.confirm({
      message: 'Are you sure to remove payment?',
      withPrompt: true,
    }).then(
      () => {
            this.laundry.delete_payment_id = payment.id;
            this.laundryService.update(this.laundry).subscribe(
              data => {
                this.laundry = data;
                this.toastr.clear();
                this.toastr.success('Payment was removed!');
                this.saving = false;
              },
              fail => {
                this.saving = false;
              }
            );
      },
      () => {
        this.saving = false;
      }
    )

  }

  deleteCharge(charge: any) {
    if (this.saving) {
      return;
    }
    this.saving = true;

    if (!confirm('Are you sure to remove charge?')) {
      this.saving = false;
      return;
    }

    const laundry = this.laundry;

    const num = Math.round(Math.random() * 10) + 2;
    const num2 = Math.round(Math.random() * 10) + 2;
    const ans = prompt(`Please answer the question to proceed.\n\n${num} x ${num2} = ?`);
    if (Number(ans) !== (num * num2)) {
      this.saving = false;
      return;
    }

    laundry.remove_charge_id = charge.id;
    this.laundryService.update(laundry).subscribe(
      data => {
        this.laundry = data;
        this.toastr.clear();
        this.toastr.success('Charge was removed!');
        this.saving = false;
      }
    );
  }

  removeAddOn(item: any){
    if (this.saving) {
      return;
    }
    this.saving = true;

    if (!confirm('Are you sure to remove add on?')) {
      this.saving = false;
      return;
    }

    const laundry = this.laundry;

    const num = Math.round(Math.random() * 10) + 2;
    const num2 = Math.round(Math.random() * 10) + 2;
    const ans = prompt(`Please answer the question to proceed.\n\n${num} x ${num2} = ?`);
    if (Number(ans) !== (num * num2)) {
      this.saving = false;
      return;
    }

    this.laundry.remove_addon_id = item.id;


    this.laundryService.update(this.laundry).subscribe(
      data => {
        this.laundry = data;
        this.toastr.success('Add on was removed!');
        this.saving = false;
      }
    )

  }


  showAddOnModal(modal: NgbModalRef) {
    this.inventoryItems = [];
    this.modalService.open(modal, { backdrop: 'static', size: 'sm'});
    this.fetchLaundryAddOns();
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

  confirmNewAddOns(){
    this.modalService.dismissAll();
    this.laundry.new_add_ons = [];
    this.inventoryItems.forEach(item => {
      const c = Number(item.add_on_count);
      if(c > 0 && c <= item.no_of_stocks) {
        this.laundry.new_add_ons.push({
          inventory_item_id: item.id,
          price: Number(item.price),
          quantity: c,
          total_amount: c * item.price
        });
      }
    });

    this.laundryService.update(this.laundry).subscribe(
      data => {
        this.laundry = data;
        this.toastr.success('New addon was set');
      }
    )
  }

  showImage(index: number, modal: NgbModalRef = null){
    if(index >= 0 && index < this.laundry.images.length){
      this.selectedImage = this.laundry.images[index];
      this.selectedImage.index = index;
    }

    if(modal)
      this.modalService.open(modal, {size:'lg'});

  }

  deleteLaundryImage(image: any){
    if (this.saving) {
      return;
    }
    this.saving = true;

    // if (!confirm('Are you sure to remove this image?')) {
    //   this.saving = false;
    //   return;
    // }

    this.modalUtils.confirm({
      message: 'Are you sure to remove this image?',
      withPrompt: true
    }).then(
      () => {

                this.laundryService.update({
                  id: this.laundry.id,
                  remove_image: image.path
                }).subscribe(
                  data => {
                    this.laundry = data;
                    if(this.laundry.images.length == 0)
                      this.modalService.dismissAll();
                    else
                      while(image.index >= this.laundry.images.length){
                        image.index--
                      }
                      this.selectedImage = this.laundry.images[image.index];
                      this.selectedImage.index = image.index;
                    this.saving = false;
                  },
                  fail => {
                    this.saving = false;
                  }
                )
      },
      () => {
        this.saving = false;
      }
    )


  }


  showAddPhotoModal(modal: NgbModalRef){
    this.images = [];
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

  savePhoto(){
    this.modalService.dismissAll();
    const laundry = { id: this.laundry.id, _base64Images: []}
    this.images.forEach( (image:WebcamImage) => {
      laundry._base64Images.push(image.imageAsBase64);
    });

    this.laundryService.update(laundry).subscribe(
      data => {
        this.laundry = data;
        this.toastr.success('Images was added!');
      }
    )
  }

  composeSms(): void{
    this.composeSmsService.compose({
      receiver: this.laundry.customer.contact_number,
      message: `MR./MS. ${this.laundry.customer.nickname ? this.laundry.customer.nickname : this.laundry.customer.name }, your laundry is now ${this.laundry.recent_action_label.toLowerCase()}`,
      args: {
        laundry_outbox: this.laundry.id
      }
    }).then(
      () => {
        this.fetchLaundry()
      },
      () => {

      }
    )
  }

}
