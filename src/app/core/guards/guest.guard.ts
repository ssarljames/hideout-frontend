import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from 'app/core/auth.service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //const currentUser = this.authenticationService.currentUserValue;
        const currentUser = this.authenticationService.getCurrentUser();
        if (!currentUser) {
            // logged in so return true
            return true;
        }

        // if logged in so redirect to home page
        this.router.navigate(['/dashboard']);
        return false;
    }
}
