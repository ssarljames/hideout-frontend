import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../core/auth.service';
import {User} from '../../../services/user';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  currentUser: User;

  constructor(authService: AuthenticationService) {
    this.currentUser = authService.getCurrentUser();
  }

  ngOnInit(): void {
  }

}
