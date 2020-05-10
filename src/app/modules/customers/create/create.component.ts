import { AuthenticationService } from './../../../core/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CustomerCreateComponent implements OnInit {
  currentUser: any = {};
  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private toastr: ToastrService) {
    this.currentUser = authenticationService.getCurrentUser();
   }

  ngOnInit() {
    if ( !this.currentUser.is_administrator && ! this.currentUser.is_personnel) {
      this.router.navigate(['/customers']);
      this.toastr.error('Access denied!');
    }
  }

}
