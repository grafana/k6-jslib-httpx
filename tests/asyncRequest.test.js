import { Httpx } from '../src/httpx.js';
import chai, { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';

chai.config.aggregateChecks = false;
chai.config.logFailures = true;

let session = new Httpx({ baseURL: 'https://test-api.k6.io' });

export default async function() {
  await describe('01. test async helper methods', async () => {
    let asyncGET = await session.asyncGet('https://httpbin.test.k6.io/get');
    let asyncPOST = await session.asyncPost('https://httpbin.test.k6.io/post');
    let asyncPUT = await session.asyncPut('https://httpbin.test.k6.io/put');
    let asyncDELETE = await session.asyncDelete('https://httpbin.test.k6.io/delete');

    expect(asyncGET.status, "asyncGet").to.equal(200);
    expect(asyncPOST.status, "asyncPost").to.equal(200);
    expect(asyncPUT.status, "asyncPut").to.equal(200);
    expect(asyncDELETE.status, "asyncDelete").to.equal(200);
  });

  await describe('02. test asyncRequest', async () => {
    let asyncGET = await session.asyncRequest('GET','https://httpbin.test.k6.io/get');
    let asyncPOST = await session.asyncRequest('POST','https://httpbin.test.k6.io/post');
    let asyncPUT = await session.asyncRequest('PUT','https://httpbin.test.k6.io/put');
    let asyncDELETE = await session.asyncRequest('DELETE','https://httpbin.test.k6.io/delete');

    expect(asyncGET.status, "asyncRequest GET").to.equal(200);
    expect(asyncPOST.status, "asyncRequest POST").to.equal(200);
    expect(asyncPUT.status, "asyncRequest PUT").to.equal(200);
    expect(asyncDELETE.status, "asyncRequest DELETE").to.equal(200);
  });

  await describe('02. invalid method raises exception', async () => {
    try{
      let response = await session.asyncRequest('GEM','https://httpbin.test.k6.io/get')
      expect(response.status, "this should never happen").to.equal(999); // this should never happen because promise is rejected
    }
    catch(e){
      console.log(typeof e)
      expect(e).to.be.an('error'); 
    }
  });

  await describe('02. insufficient number of params raises exception', async () => {
    try{
      let response = await session.asyncRequest('GET')
      expect(response.status, "this should never happen").to.equal(999); // this should never happen because promise is rejected
    }
    catch(e){
      console.log(typeof e)
      expect(e).to.be.an('error'); 
    }
  });

}
