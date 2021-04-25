import { HttpClient } from '@angular/common/http';
import { Serializer } from './serializer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';

export class ResourceService {
  private meta:any = {};
  constructor(
              private httpClient: HttpClient,
              private resource: string,
              public host: string = null) {

      if (!this.host) {
        this.host = environment.apiUrl;
      }
  }

  public getResourceURI(){
    return `${this.host}/${this.resource}`;
  }

  public get(url: string): Observable<any>{
    return this.httpClient.get<any[]>(`${this.host}/${url}`);
  }

  public queryRaw(queryOptions: any): Observable<any>{
    return this.httpClient.get<any[]>(`${this.host}/${this.resource}`, queryOptions);
  }

  public create(item: any): Observable<any> {
    return this.httpClient
      .post<any>(`${this.host}/${this.resource}`, item);
  }


  public update(item: any): Observable<any> {
    const isFormData = (item instanceof FormData);
    const id = isFormData ? item.get('id') : item.id;

    if(isFormData)
      item.append('_method', 'PUT');
    else
      item._method = 'PUT';

    return this.httpClient.post<any>(`${this.host}/${this.resource}/${id}`, item );
  }

  // public updateForm(item: FormData): Observable<any> {
  //   return this.httpClient
  //     .put<any>(`${this.host}/${this.resource}/${item.get('id')}`, item );
  // }

  public save(item: any): Observable<any>{
    if( ((item instanceof FormData)  &&  item.get('id').toString() == "undefined") || (!(item instanceof FormData) && !item.id))
      return this.create(item)
    return this.update(item);
  }


  public read(id: any): Observable<any> {
    return this.httpClient.get(`${this.host}/${this.resource}/${id}`);
  }

  public query(queryOptions: {} = {}): Observable<any> {
    return this.httpClient
      .get<any>(`${this.host}/${this.resource}`, queryOptions)
      .pipe(map((response: any) => this.convertData(response)));
  }

  public delete(id: any) {
    return this.httpClient
      .delete(`${this.host}/${this.resource}/${id}`);
  }

  private convertData(response: any): any[] {
    for (const key in response) {
      if (response.hasOwnProperty(key) && key != "data") {
        const element = response[key];
        this.meta[key] = element;
      }
    }
    return response.data;
  }

  public getMeta():any{
    return this.meta;
  }
}
