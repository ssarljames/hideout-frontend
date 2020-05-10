import { HttpClient } from '@angular/common/http';
import { CashCountService } from 'app/services/cash_count';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItems } from 'app/shared/menu-items/menu-items';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/auth.service';
import { EchoService } from 'angular-laravel-echo';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent implements OnInit, OnDestroy {


  for_approvals = 0;
  fetching = false;

  pollFn: any;

  constructor(public menu: MenuItems,
              public route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private echoService: EchoService,
              private http: HttpClient,
              private cashCountService: CashCountService ) {

  }

  ngOnInit() {


    if ( !this.authenticationService.getCurrentUser().is_cashier && environment.production) {
        //       this.echoService.join('cash-counts', 'private');
        //       console.log('connected to cash-counts from side nav');

        //       this.echoService.listen('cash-counts', 'CashCountCreated').subscribe(
        //         data => {
        //           console.log('sidenav event: CashCountCreated');
        //           this.fetchCashCountSummary();
        //         }
        //       );
        //       this.echoService.listen('cash-counts', 'CashCountUpdated').subscribe(
        //         data => {
        //           console.log('sidenav event: CashCountUpdated');
        //           this.fetchCashCountSummary();
        //         }
        //       );
        //       this.echoService.listen('cash-counts', 'CashCountDeleted').subscribe(
        //         data => {
        //           console.log('sidenav event: CashCountDeleted');
        //           this.fetchCashCountSummary();
        //         }
        //       );
        //       this.fetchCashCountSummary();

        this.fetchCashCountSummary();
        const sec = 10;
        this.pollFn = setInterval( () => {
          this.fetchCashCountSummary();
        }, sec * 1000);
    }



  }

  ngOnDestroy(): void {
    clearInterval(this.pollFn);
  }

  isAllowed(roles: [], user_groups: []){
    let allowed_role = (roles.length === 0);
    let allowed_user_group = (user_groups.length === 0);

    const user = this.authenticationService.getCurrentUser();
    if(!allowed_role)
      roles.forEach(el => {
          if (user.role === el) {
            allowed_role = true;
          }
      });

    if(!allowed_user_group)
      user_groups.forEach(el => {
          if (user.user_group_id === el) {
            allowed_user_group = true;
          }
      });



    return allowed_role && allowed_user_group;
  }

  fetchCashCountSummary() {
    this.cashCountService.get('cash-counts-for-approval').subscribe(
        (response: any) => {
          this.for_approvals = response.count;
        },
        (failed) => {

        }
      )
  }
}
