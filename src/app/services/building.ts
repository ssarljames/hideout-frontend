import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from 'app/core/resource.service';


@Injectable({
  providedIn: 'root'
})
export class BuildingService extends ResourceService{


  constructor(private http: HttpClient) {
    super(http, 'buildings');
  }
}
