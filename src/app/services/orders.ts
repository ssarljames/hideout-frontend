import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from 'app/core/resource.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrderService extends ResourceService{
  constructor(private http: HttpClient) {
    super(http, 'orders');
  }
}
