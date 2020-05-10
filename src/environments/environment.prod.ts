


const host = 'https://hideout-backend.herokuapp.com';
const api = host + '/api/v1';
// const host = 'http://localhost';
// const api = host + ':8000/api/v1';

export const environment = {
  production: true,
  apiUrl: api,
  authUrl: {
    login: api + '/login',
    logout: api + '/logout'
  },
  websocket: host + ':6001',
  version: '1.4'
};
