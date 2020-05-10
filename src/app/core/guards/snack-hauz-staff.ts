import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from 'app/core/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class SnackHauzStaffGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private toastr: ToastrService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authenticationService.getCurrentUser();
        const allowed = user.is_administrator || user.is_snack_hauz_staff;
        if (!allowed) {
          this.toastr.error('This page is available to administrator and snack hauz staff only');
        }
        return allowed;
    }
}
