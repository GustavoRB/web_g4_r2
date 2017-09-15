'use strict';

const chai = require('chai');
const chaihttp = require('chai-http');
const TestManager = require('../TestManager');

chai.use(chaihttp);

let expect = chai.expect;

let testManager = null;

describe('Teste usuario api/open', () => {
  before(function (done) {
    testManager = new TestManager(done);
  });

  it('get fabricantes', (done) => {
    chai.request('http://localhost:1337')
      .get('/api/open/fabricantes')
      .end(async (err, res) => {

        expect(res).to.have.status(200);

        done();
      });
  });

});