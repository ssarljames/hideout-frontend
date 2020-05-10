import { StateService } from './../../core/state.service';
import { CashCountService } from 'app/services/cash_count';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EchoService } from 'angular-laravel-echo';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/auth.service';

import * as moment from 'moment';
import { InventoryItemService } from 'app/services/inventory_item';
import { MealCategoryService } from 'app/services/meal_category';
import { MealService } from 'app/services/meal';
import { Meal } from 'app/models/meal/meal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  users: any[];
  currentUser: any;
  cashCountSummary: any = null;
  inventorySummary: any = {
    low_in_stock: 0
  };
  randomNumbers = 0;
  interval: any = null;

  meals: Meal[];

  constructor(private echoService: EchoService,
              private toastrService: ToastrService,
              private authenticationService: AuthenticationService,
              private cashCountService: CashCountService,
              private mealService: MealService,
              private stateService: StateService,
              private inventoryItemService: InventoryItemService){

      // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

      this.currentUser = authenticationService.getCurrentUser();

  }


  ngOnInit() {
    this.connectEcho();
    this.fetchCashCountSummary();
    this.fetchInventorySummary();

    const state = this.stateService.get('dashboard');

    if(state){
      this.meals = state.meals;
    }

    this.mealService.query().subscribe(
      data => {
        this.meals = data;
      }
    )
  }

  ngOnDestroy(){
    this.echoService.leave('cash-counts');

    this.stateService.set('dashboard',{
      meals: this.meals
    });
  }

  connectEcho(){
    this.echoService.join('cash-counts', 'private');
    this.echoService.listen('cash-counts', 'CashCountCreated').subscribe(
      data => {
        this.fetchCashCountSummary()
      }
    );
    this.echoService.listen('cash-counts', 'CashCountUpdated').subscribe(
      data => {
        this.fetchCashCountSummary()
      }
    );
    this.echoService.listen('cash-counts', 'CashCountDeleted').subscribe(
      data => {
        this.fetchCashCountSummary()
      }
    );
  }

  randomize(){
    this.interval = setInterval(() => {
      this.randomNumbers += Math.random() * 100; // (++this.randomNumbers) % 100;
    }, 100);
  }

  fetchCashCountSummary(): void {
    this.cashCountSummary = null;
    this.randomize();
    this.cashCountService.query({
      params: {
        from_date: moment().format('YYYY-MM-DD'),
        to_date: moment().format('YYYY-MM-DD'),
        summary: true
      },
    }).subscribe(
      data => {
        setTimeout(() => {
          this.cashCountSummary = this.cashCountService.getMeta();
          clearInterval(this.interval);
        }, 500);
      },
      error => {
        clearInterval(this.interval);
        this.randomNumbers = 0;
      }
    );
  }


  fetchInventorySummary(){
    this.inventoryItemService.query({
      params: {
        summary: true
      }
    }).subscribe(
      data => {
        this.inventorySummary = this.inventoryItemService.getMeta();
      }
    )
  }



}
