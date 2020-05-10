import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../core/resource.service';


@Injectable({
  providedIn: 'root'
})
export class MealService extends ResourceService{
  constructor(private http: HttpClient) {
    super(http, 'meals');
  }

  public updateMealAvailability(meals: any): Observable<any>{
    return this.http.post(this.getResourceURI() + '/update-meal-availability', meals );
  }
}
