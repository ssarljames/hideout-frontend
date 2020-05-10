import { ModalService } from 'app/shared/services/modal/modal.service';
import { MatCheckboxChange } from '@angular/material';
import { EchoService } from 'angular-laravel-echo';
import { StateService } from 'app/core/state.service';
import { Inbox } from 'app/models/sms/inbox/inbox';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmsService } from 'app/services/sms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnDestroy {

  inbox: Inbox[] = [];
  checked_all: boolean = false;

  constructor(private smsService: SmsService,
              private stateService: StateService,
              private echoService: EchoService,
              private toastr: ToastrService,
              private modal: ModalService) { }

  ngOnInit() {
    const _in = this.stateService.get('sms.inbox');

    if(_in)
      this.inbox = _in.inbox;

    this.fetchSmsInbox();

    this.echoService.join('sms.inbox', 'private');
    this.echoService.listen('sms.inbox', 'NewSmsInboxWasAdded').subscribe(
      () => {
        this.fetchSmsInbox();
      }
    );
  }

  ngOnDestroy() {
    this.stateService.set('sms.inbox',{
      inbox: this.inbox
    });
  }

  fetchSmsInbox(): void{
    let checked_all = true;
    this.smsService.query({
      params: {
        sms: 'inbox'
      }
    }).subscribe(
      (data:Inbox[]) => {
        data.forEach( m => {
          const o1: Inbox[] = this.inbox.filter( i => i.id == m.id);
          m.checked = o1.length == 1 && o1[0].checked;

          checked_all = checked_all && m.checked;
        });

        this.checked_all = checked_all

        this.inbox = data;
      }
    )
  }

  checkAllToggle(): void{
    this.inbox.forEach( m => {
      m.checked = this.checked_all;
    });
  }

  checkChange($event: MatCheckboxChange, m: Inbox): void{
    console.log(m);


    if(!m.checked)
      this.checked_all = false;

  }


  deleteChecked(): void{

    this.modal.confirm({
      'message': 'Are you sure to delete all checked items?',
      'type': 'danger',
      withPrompt: true
    }).then(
      () => {
              const checkedItems: Inbox[] = this.inbox.filter( m => m.checked);

              let ids: string[] = [];

              checkedItems.forEach( (m:Inbox) => {
                ids.push(m.id);
              });

              this.smsService.create({
                'delete_ids' : ids,
                'type': 'inbox'
              }).subscribe(
                data => {
                  this.fetchSmsInbox();
                  this.toastr.info('Sms were deleted successfully!');
                }
              );
      },
      () => {

      }
    )


  }

}
