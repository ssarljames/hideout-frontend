import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const ADMINISTRATOR = 1;
const PERSONNEL     = 2;
const CASHIER       = 3;

const ADMINISTRATION    = 1;
const DIGITAL_PRINTING  = 2;
const LAUNDRY_SHOP      = 3;
const GAME_PAD          = 4;
const SNACK_HAUZ        = 5;

const MENUITEMS = [
  {
    state: '/dashboard',
    name: 'Dashboard',
    type: 'link',
    icon: 'fa fa-dashboard',
    roles: [],
    user_groups: []
  },
  {
    state: '/cash-counts',
    name: 'Cash Counts',
    type: 'link',
    icon: 'fa fa-money',
    roles: [],
    user_groups: []
  },
  {
    state: '/vault',
    name: 'Vault',
    type: 'link',
    icon: 'fa fa-shield',
    roles: [ADMINISTRATOR],
    user_groups: [ADMINISTRATION]
  },
  {
    state: '/inventory',
    name: 'Inventory',
    type: 'link',
    icon: 'fa fa-book',
    roles: [ADMINISTRATOR],
    user_groups: [1]
  },
  {
    state: '/snack-hauz',
    name: 'Snack Hauz',
    type: 'link',
    icon: 'fa fa-spoon',
    roles: [ADMINISTRATOR, PERSONNEL],
    user_groups: [ADMINISTRATION, SNACK_HAUZ]
  },
  {
    state: '/laundry',
    name: 'Laundry',
    type: 'link',
    icon: 'fa fa-shopping-basket',
    roles: [],
    user_groups: [ADMINISTRATION, LAUNDRY_SHOP]
  },
  {
    state: '/customers',
    name: 'Customers',
    type: 'link',
    icon: 'fa fa-user',
    roles: [],
    user_groups: []
  },
  // { state: '/users', name: 'User Accounts', type: 'link', icon: 'fa fa-users', roles: [1] },
  // { state: '/configurations', name: 'Configurations', type: 'link', icon: 'fa fa-cogs', roles: [1] },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
