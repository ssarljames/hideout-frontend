import { User } from '../services/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// import { User } from 'app/models/user';

import { environment } from 'environments/environment';
import { EchoService } from 'angular-laravel-echo';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    // private currentUserSubject: BehaviorSubject<User>;
    // public currentUser: Observable<User>;

     private _currentUser: User;

    private loginUrl: string;
    private logoutUrl: string;
    private password_secured = false;

    constructor(private http: HttpClient, private echoService: EchoService) {

      this.loginUrl = environment.authUrl.login;
      this.logoutUrl = environment.authUrl.logout;

      if ( !environment.production ) {
        try {
          const currentUserStr = localStorage.getItem('currentUser');
          const currentUserJSON = JSON.parse(currentUserStr);
          // this.currentUserSubject = new BehaviorSubject<User>(currentUserJSON);
          // this.currentUser = this.currentUserSubject.asObservable();

          this._currentUser = currentUserJSON;

          if (currentUserJSON){
              this.echoService.login({
                'Authorization': `Bearer ${currentUserJSON.token}`
              }, currentUserJSON.id);
          }
        } catch (e) {
          console.log(e);
          alert(e.message)
        }
      } else {
        this._currentUser = null;
      }
    }

    // public get currentUserValue(): User {
    //     return this.currentUserSubject.value;
    // }

    public getCurrentUser() {
      if ( !environment.production && !this._currentUser) {
        this._currentUser = JSON.parse(localStorage.getItem('currentUser'));
      }
      return this._currentUser;
    }

    login(username: string, password: string) {
        return this.http.post<any>(this.loginUrl, { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                  if ( !environment.production ) {
                    localStorage.removeItem('currentUser');
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    // this.currentUserSubject.next(user);
                  }

                  this._currentUser = user;

                  this.echoService.login({
                    'Authorization': `Bearer ${user.token}`
                  }, user.id);
                }

                return user;
            }));
    }

    logout() {
        if (this._currentUser) {
              this.http.get<any>(this.logoutUrl).subscribe();
        }

        if ( !environment.production ) {
          // remove user from local storage to log user out
          localStorage.removeItem('currentUser');
        }

        this.echoService.logout();

        // this.currentUserSubject.next(null);
        this._currentUser = null
    }
}
