import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LaundryService } from 'app/services/laundry';
import { AddPaymentService } from '../add-payment-modal/add-payment.service';

@Component({
  selector: 'app-add-action-modal',
  templateUrl: './add-action-modal.component.html',
  styleUrls: ['./add-action-modal.component.scss']
})
export class AddActionModalComponent implements OnInit {

  @Input() laundry: any;

  saving: boolean;

  actions: any[] = [];
  washing_machines: any[] = [];
  dryers: any[] = [];

  new_action: any = {
    description: null,
    machine_id: null,
    remarks: null,
    send_sms_notification: true
  };

  constructor(private activeModal: NgbActiveModal,
              private laundryService: LaundryService,
              private toastr: ToastrService,
              private paymentService: AddPaymentService) { }

  ngOnInit() {

    this.init();

  }

  init(){


    this.new_action = {
      description: null,
      machine_id: null,
      remarks: null,
      send_sms_notification: true
    };

    this.actions = [];
    this.laundryService.query({
      params: {
        config: 1,
        laundry_id: this.laundry.id
      }
    }).subscribe(
        () => {
            const meta = this.laundryService.getMeta();
            const actions = meta.actions;
            for (const key in actions) {
                if (actions.hasOwnProperty(key)) {
                    const element = actions[key];
                    this.actions.push({name: element, value: key});
                }
            }
            this.washing_machines = meta.washing_machines;
            this.dryers = meta.dryers;
        }
    );
  }

  d(reason: string = null): void{
    this.activeModal.dismiss(reason);
  }


  saveNewAction() {

      if (this.saving) {
        return;
      }
      this.saving = true;
      this.laundry.new_action = this.new_action;

      this.laundryService.update(this.laundry).subscribe(
        () => {
          this.toastr.success('Action saved!');
          this.activeModal.close();
          this.saving = false;
        },
        () => {
          this.saving = false;
        }
      );
    }

    showPayment(): void{
      this.paymentService.show(this.laundry).then(
        (data) => {

          this.activeModal.close();

        },
        () => {

        }
      )
    }

}
