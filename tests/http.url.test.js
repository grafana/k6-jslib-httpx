import { Httpx, Get } from '../src/httpx.js';
import { describe } from 'https://jslib.k6.io/expect/0.0.4/index.js';

import http from "k6/http";

let session = new Httpx({ baseURL: 'https://test-api.k6.io' });

export default function() {
  let a = 'value';
  session.get(http.url`/?var=${a}`); 

    describe('01. Fetch public crocodiles all at once', (t) => {
      let a1 = '1';
      let a2 = '2';
      let a3 = '3';
      let a4 = '4';
      
      let responses = session.batch([
        new Get(http.url`/public/crocodiles/${a1}/`),
        new Get(http.url`/public/crocodiles/${a2}/`),
        new Get(http.url`/public/crocodiles/${a3}/`),
        new Get(http.url`/public/crocodiles/${a4}/`),
      ], {
        tags: {name: 'PublicCrocs'}
      });
  
      responses.forEach(response => {
        t.expect(response.status).as("response status").toEqual(200)
          .and(response).toHaveValidJson()
          .and(response.json('age')).as('croc age').toBeGreaterThan(7);
      });
    });

    describe('02. Absolute URLs override the baseURL', (t) => {
      let relativeURL = session.get('/public/crocodiles/1'); //
      let absoluteURL = session.get('https://httpbin.test.k6.io/get'); // should work.

      t.expect(relativeURL.status).as("relative URL").toEqual(200);
      t.expect(absoluteURL.status).as("absolute URL").toEqual(200);
    });

}
