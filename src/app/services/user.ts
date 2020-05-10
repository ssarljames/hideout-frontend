import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Serializer } from 'app/core/serializer';
import { Moment} from 'moment';
import { Resource } from 'app/core/resource';
import { ResourceService } from 'app/core/resource.service';


export class User extends Resource{

  public token: string;
  // public password;
  public role: number;
  public fullname: string;
  public is_secured: boolean;
  public is_administrator: boolean;
  public is_personnel: boolean;
  public is_cashier: boolean;
  public profile_picture_path: string;
  public user_group_id: number;
  public is_laundry_shop_staff: boolean;
  public is_snack_hauz_staff: boolean;
  constructor(
    public id: string,
    public username: string,
    public created_at: Moment,
    public updated_at: Moment
  ){
    super();
  }


  public static createNew(){
    return new User(null,null,null, null);
  }

  public isNew() : boolean{
    return !this.id;
  }
}



export class UserSerializer implements Serializer {

  fromJson(json: any): User {
      return new User(json.id,
                      json.username,
                      json.created_at,
                      json.updated_at);
  }

  toJson(user: User): any {
    let userJson:any = {};

    // if(user.id){
    //   userJson.id = user.id;
    //   userJson.password = user.password;
    // }

    userJson.username = user.username;

    return userJson;

  }
}



@Injectable({
  providedIn: 'root'
})
export class UserService extends ResourceService{
  constructor(private http: HttpClient) {
    super(http, 'users');
  }
}
