import { environment as e } from './environment.prod';
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.



const host = 'http://hideout.local';
const port = '';
const api = host + `${port}/api/v1`;

export const environment = {
  production: false,
  apiUrl: api,
  authUrl: {
    login: api + '/login',
    logout: api + '/logout'
  },
  websocket: host + ':6001',
  version: e.version + ' Dev'
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
