import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from 'app/core/resource.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrderMealService extends ResourceService{
  constructor(private http: HttpClient) {
    super(http, 'order-meals');
  }

  public getStatusAvailable(id): Observable<any> {
    return this.http.get(this.getResourceURI() + `?get_available_status=${id}`);
  }
}
