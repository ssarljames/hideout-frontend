import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

import { ContentComponent } from './components/content/content.component';


/// Guards

import { GuestGuard } from './core/guards/guest.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { LaundryStaffGuard } from './core/guards/laundry-staff';
import { SnackHauzStaffGuard } from './core/guards/snack-hauz-staff';



const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard]
  },
  {
    path: '',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: [
        {
          path: 'dashboard',
          component: HomeComponent
        },
        {
          path: 'customers',
          loadChildren: './modules/customers/customers.module#CustomersModule'
        },
        {
          path: 'vault',
          loadChildren: './modules/vault/vault.module#VaultModule'
        },
        {
          path: 'cash-counts',
          loadChildren: './modules/cash-counts/cash-counts.module#CashCountsModule'
        },
        {
          path: 'inventory',
          loadChildren: './modules/inventory/inventory.module#InventoryModule'
        },
        {
          path: 'snack-hauz',
          loadChildren: './modules/snack-hauz/snack-hauz.module#SnackHauzModule',
          canActivate: [SnackHauzStaffGuard]
        },
        {
          path: 'laundry',
          loadChildren: './modules/laundry/laundry.module#LaundryModule',
          canActivate: [LaundryStaffGuard]
        },
        {
          path: 'users',
          loadChildren: './modules/users/users.module#UsersModule',
          canActivate: [AdminGuard]
        },
        {
          path: 'configurations',
          loadChildren: './modules/configurations/configurations.module#ConfigurationsModule',
          canActivate: [AdminGuard]
        },
        {
          path: 'sms',
          loadChildren: './modules/sms/sms.module#SmsModule',
          canActivate: [AdminGuard]
        },
        {
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'full'
        },
    ]
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
