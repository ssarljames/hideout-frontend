import {FormGroup} from '@angular/forms';

export abstract class Model {

  public id?: number;


  public created_at?: Date;
  public updated_at?: Date;

  public _method?: string;

  public storeName: string;

  private __needToSync: boolean;

  public isBeingRemove: boolean = false;

  public constructor(props = {}, storeName: string = 'Models', needToSync: boolean = false) {
    this.fill(props);
    this.afterConstructed();
    this.storeName = storeName;
    this.__needToSync = needToSync;
  }

  public fill?(obj: any): any {

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        this[key] = obj[key];
      }
    }

    return this;
  }

  public get needToSync(): boolean {
    return this.__needToSync;
  }


  public formFill?(form: FormGroup): any {

    for (const key in form.controls) {
      if (form.controls.hasOwnProperty(key)) {
        this[key] = form.controls[key].value;
      }
    }

    return this;
  }

  public set?(name: string, value: any): any {
    this[name] = value;
    return this;
  }

  /**
   * Method called after the contructor
   */
  abstract afterConstructed(): void;


  public toJson(): any {
    const json = {};

    Object.getOwnPropertyNames(this).forEach(property => {
      json[property] = this[property];
    });

    return json;
  }
}
