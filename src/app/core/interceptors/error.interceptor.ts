import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from 'app/core/auth.service';

import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';



@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,
                private toastr: ToastrService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log(err);

            if (err.status === 401 && err.error.message === 'Unauthenticated.') {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                this.toastr.error('Session expired.');
                setTimeout( () => {
                    location.reload(true);
                }, 2000);
                // console.log(err.message);

            }else if(err.status == 404){
                this.toastr.error('API Resource not found!');
            }// }else if(!environment.production)
            //     this.toastr.error(err.error.message || err.statusText);
            else {
                console.log(err.error.message || err.statusText);
            }

            return throwError(err);
        }));
    }
}
