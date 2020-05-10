import { Outbox } from 'app/models/sms/outbox/outbox';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from 'app/core/resource.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SmsService extends ResourceService{
  constructor(private http: HttpClient) {
    super(http, 'sms');
  }
}
