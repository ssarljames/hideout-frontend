import { ComposeSmsService } from './compose-modal/compose-modal.service';
import { ModalService } from 'app/shared/services/modal/modal.service';
import { StateService } from 'app/core/state.service';
import { EchoService } from 'angular-laravel-echo';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Outbox } from 'app/models/sms/outbox/outbox';
import { SmsService } from 'app/services/sms';
import * as moment from 'moment';

@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.scss']
})
export class OutboxComponent implements OnInit, OnDestroy {

  outbox: Outbox[] = [];
  checked_all: boolean = false;

  constructor(private smsService: SmsService,
              private echoService: EchoService,
              private stateService: StateService,
              private modal: ModalService,
              private composeSmsService: ComposeSmsService) { }

  ngOnInit() {

    const _ = this.stateService.get('sms.outbox');
    if(_){
      this.outbox = _.outbox;
    }

    this.fetchSmsOutbox();

    this.echoService.listen('sms.outbox', 'SmsOutboxCreated').subscribe(
      () => {
        this.fetchSmsOutbox();
      }
    );
    this.echoService.listen('sms.outbox', 'SmsOutBoxSendingFailed').subscribe(
      () => {
        this.fetchSmsOutbox();
      }
    );
    this.echoService.listen('sms.outbox', 'SmsOutBoxSent').subscribe(
      () => {
        this.fetchSmsOutbox();
      }
    );

  }

  ngOnDestroy(){
    this.stateService.set('sms.outbox', {
      outbox: this.outbox
    });
  }

  fetchSmsOutbox(): void{
    let checked_all = true;
    this.smsService.query({
      params: {
        sms: 'outbox'
      }
    }).subscribe(
      (data:Outbox[]) => {
        data.forEach( m => {
          const o1: Outbox[] = this.outbox.filter( o => o.id == m.id);
          m.checked = o1.length == 1 && o1[0].checked;

          checked_all = checked_all && m.checked;
        });

        this.checked_all = checked_all && data.length > 0;
        this.outbox = data;
      }
    )
  }

  resend(m: Outbox): void{
    let msg: any = m;
    msg.resend = true;
    this.smsService.update(msg).subscribe(
      () => {

      }
    )
  }

  composeSms(): void{
    this.composeSmsService.compose({
      receiver: '',
      message: ''
    }).then(
      () => {
        this.fetchSmsOutbox();
      },
      () => {

      }
    );
  }



  checkAllToggle(): void{
    this.outbox.forEach( m => {
      m.checked = this.checked_all;
    });
  }

  checkChange(m: Outbox): void{
    if(!m.checked)
      this.checked_all = false;
  }

  resendChecked(): void{
    const checkedItems: Outbox[] = this.outbox.filter( m => m.checked && !moment(m.sent_at).isValid() );

    let ids: string[] = [];


    checkedItems.forEach( (m:Outbox) => {
      ids.push(m.id);
    });

    if(ids.length == 0)
      return;

    this.smsService.create({
      'resend_ids' : ids
    }).subscribe(
      data => {
        this.fetchSmsOutbox();
      }
    )

  }

  deleteChecked(): void{

    this.modal.confirm({
      'message': 'Are you sure to delete all checked items?',
      'type': 'danger',
      withPrompt: true
    }).then(
      () => {
              const checkedItems: Outbox[] = this.outbox.filter( m => m.checked);

              let ids: string[] = [];

              checkedItems.forEach( (m:Outbox) => {
                ids.push(m.id);
              });

              this.smsService.create({
                'delete_ids' : ids,
                'type': 'outbox'
              }).subscribe(
                data => {
                  this.fetchSmsOutbox();
                }
              );
      },
      () => {

      }
    )


  }

}
