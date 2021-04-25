import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StateService {

    private properties: any;

    constructor() {
      this.properties = {};
    }

    set(name: string, value: any){
      this.properties[name] = value;
    }

    get(name: string, defaultValue = null) {
      return this.properties.hasOwnProperty(name)
        ? this.properties[name]
        : defaultValue;
    }
}
