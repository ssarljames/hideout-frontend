import { Outbox } from 'app/models/sms/outbox/outbox';
import { Component, OnInit, TemplateRef } from '@angular/core';

import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/auth.service';
import { User, UserService } from 'app/services/user';
import { EchoService } from 'angular-laravel-echo';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ContentRef } from '@ng-bootstrap/ng-bootstrap/util/popup';
import { environment } from 'environments/environment';
import { NotificationService } from 'app/services/notification';

import * as moment from 'moment';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  $hideNav = true;
  currentUser: User;

  isFetchingNotifications = true;
  notifications: any[] = [];

  change_password_form: FormGroup;

  unread_notifications = 0;

  version: string;

  timeNow: string;

  constructor(
      private router: Router,
      private authenticationService: AuthenticationService,
      private echoService: EchoService,
      private modalService: NgbModal,
      private userService: UserService,
      private toastrService: ToastrService,
      private notificationService: NotificationService
  ) {

      this.change_password_form = new FormGroup({
        new_password: new FormControl('', Validators.required),
        retype: new FormControl('', Validators.required),
        old_password: new FormControl('', Validators.required),
      });

      this.version = environment.version;

      this.timeNow = moment().format('MMM D, YYYY hh:mm A (ddd)');

      setInterval(() => {
        this.timeNow = moment().format('MMM D, YYYY hh:mm:ss A (ddd)');
      }, 1000 );
    }

  ngOnInit() {

    this.currentUser = this.authenticationService.getCurrentUser();
    // if (this.currentUser.is_secured) {
    //   this.toastrService.info('Welcome!');
    // }

    this.fetchNotifications();

    this.echoService.join(`notifications.${this.authenticationService.getCurrentUser().id}`, 'private');
    this.echoService.listen(`notifications.${this.authenticationService.getCurrentUser().id}`, 'NotificationCreated')
      .subscribe(
        data => {
          this.toastrService.info('New notification received!');
          this.fetchNotifications();

        }
      );


    this.echoService.join('sms.inbox', 'private');
    this.echoService.join('sms.outbox', 'private');

    this.echoService.listen('sms.inbox', 'NewSmsInboxWasAdded').subscribe(
      () => {
        this.toastrService.info('New sms was received.');
      }
    );
    this.echoService.listen('sms.outbox', 'SmsOutBoxSendingFailed').subscribe(
      (sms: Outbox) => {
        this.toastrService.error('Sms sending was failed!');
      }
    );
    this.echoService.listen('sms.outbox', 'SmsOutBoxSent').subscribe(
      (sms: Outbox) => {
        this.toastrService.success('Sms sent');
      }
    );
    this.echoService.listen('sms.outbox', 'SmsOutboxSending').subscribe(
      (sms: Outbox) => {
        this.toastrService.info('Sms is being sent');
      }
    );
  }

  fetchNotifications() {
    this.isFetchingNotifications = true;
    this.notificationService.query().subscribe(
      data => {
        this.notifications = data;
        this.isFetchingNotifications = false;
        this.unread_notifications = this.notificationService.getMeta().unread_count;
      }
    )
  }

  logout() {

      this.authenticationService.logout();
      this.router.navigate(['/login']);
  }

  updatePassword(){
    if (this.change_password_form.invalid) {
      return;
    }

    if(this.change_password_form.controls.new_password.value !== this.change_password_form.controls.retype.value){
      this.change_password_form.controls.retype.setErrors(['Password not matched']);
      return;
    }

    this.userService.update({
      id: this.currentUser.id,
      new_password: this.change_password_form.controls.new_password.value,
      old_password: this.change_password_form.controls.old_password.value,
    }).subscribe(
      response => {
       if (response.message === 'ok') {
          this.modalService.dismissAll();
          this.toastrService.clear();
          this.toastrService.success('Password updated successfully');
          const user = this.authenticationService.getCurrentUser();
          user.is_secured = true;
          localStorage.removeItem('currentUser');
          localStorage.setItem('currentUser', JSON.stringify(user));
       } else {
          this.toastrService.error(response.message);
       }
      },
      response => {

        for (const key in response.error.errors) {
          if ( this.change_password_form.controls[key]) {
            this.change_password_form.controls[key].setErrors(response.error.errors[key]);
          }
        }
      }
    );

  }

  showChangePasswordModal(changePasswordModal: ContentRef){
    this.change_password_form.reset();
    this.modalService.open(changePasswordModal, {backdrop: 'static'});
  }

  openNotificationTab(isOpened: boolean){
    if (isOpened && this.unread_notifications > 0) {
      this.notificationService.update({
        'mark_as_read': 'all',
        'id': 0
      }).subscribe(
        data => {
          this.unread_notifications = 0;
        }
      );
    } else {
      this.notifications.forEach(n => {
        n.read = true;
      });
    }

  }

}
