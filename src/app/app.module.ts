import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, PreloadAllModules } from '@angular/router';


//Installed 3rd Party Dependencies
// import { MomentModule } from 'ngx-moment';
import { JwtModule } from '@auth0/angular-jwt';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { ToastrModule } from 'ngx-toastr';

import{ SocketIoEchoConfig, EchoService, ECHO_CONFIG, AngularLaravelEchoModule, EchoInterceptor } from 'angular-laravel-echo';

//App Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

//App Interceptors
import { JwtInterceptor,  } from 'app/core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from 'app/core/interceptors/error.interceptor';
import { SharedModule } from './shared/shared.module';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ContentComponent } from './components/content/content.component';
import { environment } from 'environments/environment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { TopNavComponent } from './components/top-nav/top-nav.component';


const toastrConfig = {
  timeOut: 5000,
  positionClass: 'toast-bottom-left',
  preventDuplicates: true,
};


// /***************     JWT     ****************/
// export function jwtTokenGetter() {
//       try {
//         return  JSON.parse(localStorage.getItem('currentUser')).token;
//       } catch (e) {
//         console.log('Token not found');
//       }
//       return null;
// };

/************** Laravel Echo  ***************/
export const echoConfig: SocketIoEchoConfig = {
  userModel: 'App.User',
  notificationNamespace: ' App\\Events',
  options: {
    broadcaster: 'socket.io',
    host: environment.websocket
  }
}
/********************************************/


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'MMM DD, YYYY (ddd)',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    NotFoundComponent,
    HomeComponent,
    LoginComponent,
    ContentComponent,
    TopNavComponent,
  ],
  imports: [
    

    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgProgressModule,
    NgProgressHttpModule.withConfig({
      silentApis: [
                    `${environment.apiUrl}/notifications`,
                    `${environment.apiUrl}/types`,
                    `${environment.apiUrl}/laundries?summary=1`,
                    `${environment.apiUrl}/cash-counts-for-approval`
                  ]
    }),


    RouterModule.forRoot([], {
      preloadingStrategy: PreloadAllModules
    }),
    
    ToastrModule.forRoot(toastrConfig) ,

    JwtModule,

    AngularLaravelEchoModule.forRoot(echoConfig),
  ],
  providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

        {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
