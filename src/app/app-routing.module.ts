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
          loadChildren: () => import('./modules/customers/customers.module').then(m => m.CustomersModule)
        },
        {
          path: 'vault',
          loadChildren: () => import('./modules/vault/vault.module').then(m => m.VaultModule)
        },
        {
          path: 'cash-counts',
          loadChildren: () => import('./modules/cash-counts/cash-counts.module').then(m => m.CashCountsModule)
        },
        {
          path: 'inventory',
          loadChildren: () => import('./modules/inventory/inventory.module').then(m => m.InventoryModule)
        },
        {
          path: 'snack-hauz',
          loadChildren: () => import('./modules/snack-hauz/snack-hauz.module').then(m => m.SnackHauzModule),
          canActivate: [SnackHauzStaffGuard]
        },
        {
          path: 'laundry',
          loadChildren: () => import('./modules/laundry/laundry.module').then(m => m.LaundryModule),
          canActivate: [LaundryStaffGuard]
        },
        {
          path: 'users',
          loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
          canActivate: [AdminGuard]
        },
        {
          path: 'configurations',
          loadChildren: () => import('./modules/configurations/configurations.module').then(m => m.ConfigurationsModule),
          canActivate: [AdminGuard]
        },
        {
          path: 'sms',
          loadChildren: () => import('./modules/sms/sms.module').then(m => m.SmsModule),
          canActivate: [AdminGuard]
        },
        {
          path: 'internet-service',
          loadChildren: () => import('./modules/internet-service/internet-service.module').then(m => m.InternetServiceModule),
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
