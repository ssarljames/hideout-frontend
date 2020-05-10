import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from 'app/core/resource.service';


@Injectable({
  providedIn: 'root'
})
export class VaultEntryService extends ResourceService{
  constructor(private http: HttpClient) {
    super(http, 'vault-entries');
  }


  public getTypes(): Observable<any[]> {
      return this.http.get<any[]>(`${this.host}/vault-entries/types`);
  }

}
