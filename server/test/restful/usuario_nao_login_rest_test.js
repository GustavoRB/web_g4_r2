'use strict';

const path = require('path');
const chai = require('chai');
const chaihttp = require('chai-http');
const TestManager = require('../TestManager');
const msgerro = require('../../util/messages.json');
const moipteste = require('../../apis_pagamento/moip_payment');

chai.use(chaihttp);

let should = chai.should();
let expect = chai.expect;

let testManager = null;

describe('Teste usuario api/open', () => {
  before(function (done) {
    testManager = new TestManager(done);
  });

  it('1. teste ', (done) => {
    chai.request('http://localhost:1337')
      .get('/api/open/estabelecimentos')
      .query({lat: '-27.586117', long: '-48.502191', limit: 10})
      .end(async (err, res) => {

        expect(res).to.have.status(200);
        expect(res.body._issuccess).to.be.true;
        expect(res.body._data).to.be.instanceOf(Array);

        done();
      });
  });

});