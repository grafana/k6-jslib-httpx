# k6-jslib-httpx
httpx JavaScript library 

Docs: https://grafana.com/docs/k6/latest/javascript-api/jslib/httpx

Download the latest release from https://jslib.k6.io/


## Example

```javascript
import { test } from 'https://jslib.k6.io/functional/0.0.1/index.js';
import { Httpx } from 'https://jslib.k6.io/httpx/0.0.6/index.js';
import { randomIntBetween, 
         randomItem } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

const USERNAME = `user${randomIntBetween(1, 100000)}@example.com`;  // random email address
const PASSWORD = 'superCroc2021';

let session = new Httpx({
    baseURL: 'https://test-api.k6.io', 
    headers: {
        'User-Agent': "My custom user agent",
        "Content-Type": 'application/x-www-form-urlencoded' 
    },
    timeout: 20000 // 20s timeout.
});

export default function testSuite() {

  test(`Create a test user ${USERNAME}`, (t) => {

    let resp = session.post(`/user/register/`, {
      first_name: 'Crocodile',
      last_name: 'Owner',
      username: USERNAME,
      password: PASSWORD,
    });

    t.expect(resp.status).as("status").toEqual(201)
      .and(resp).toHaveValidJson();
  })

  &&

  test(`Authenticate the new user ${USERNAME}`, (t) => {

    let resp = session.post(`/auth/token/login/`, {
      username: USERNAME,
      password: PASSWORD
    });

    t.expect(resp.status).as("Auth status").toBeBetween(200, 204)
      .and(resp).toHaveValidJson()
      .and(resp.json('access')).as("auth token").toBeTruthy();

    let authToken = resp.json('access');
    // set the authorization header on the session for the subsequent requests.
    session.addHeader('Authorization', `Bearer ${authToken}`);

  })

  &&

  test('Create a new crocodile', (t) => {
    let payload = {
      name: `Croc Name`,
      sex: randomItem(["M", "F"]),
      date_of_birth: '2019-01-01',
    };

    let resp = session.post(`/my/crocodiles/`, payload);

    t.expect(resp.status).as("Croc creation status").toEqual(201)
      .and(resp).toHaveValidJson();
  })

}

```
