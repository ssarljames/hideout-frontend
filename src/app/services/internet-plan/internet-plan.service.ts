import { Injectable } from '@angular/core';
import {ResourceService} from '../../core/resource.service';
import {HttpClient} from '@angular/common/http';
import {InternetPlan} from '../../models/internet-plan/internet-plan';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternetPlanService extends ResourceService{


  constructor(private http: HttpClient) {
    super(http, 'internet-plans');
  }
}
