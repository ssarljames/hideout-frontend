import { SmsService } from 'app/services/sms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { Outbox } from 'app/models/sms/outbox/outbox';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-compose-modal',
  templateUrl: './compose-modal.component.html',
  styleUrls: ['./compose-modal.component.scss']
})
export class ComposeModalComponent implements OnInit {

  @Input() receiver: string;
  @Input() message: string;
  @Input() args: string;

  smsOutbox: Outbox;

  constructor(private activeModal: NgbActiveModal,
              private smsService: SmsService,
              private toastr: ToastrService) {

                this.smsOutbox = new Outbox();

              }

  ngOnInit() {
    this.smsOutbox.receiver = this.receiver;
    this.smsOutbox.message = this.message;
  }

  send(){
    let sms: any = this.smsOutbox;
    sms.args = this.args;
    this.smsService.create(sms).subscribe(
      () => {
        this.toastr.info('Message is now sending...');
        this.activeModal.close();
      },
      () => {
        this.toastr.success('Sending failed! :(');
      }
    )
  }

  dismiss(): void{
    this.activeModal.dismiss();
  }

}
