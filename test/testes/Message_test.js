'use strict';

const chai = require('chai');
const chaihttp = require('chai-http');
const TestManager = require('./../TestManager');
const fs = require('fs');

let authy = require('../../util/Authy');

chai.use(chaihttp);

let testManager = null;

describe('Teste de manager país', () => {
  before(function(done) {
    testManager = new TestManager(done);
  });

  after(async function() {
    await testManager.destroy();
  });

  it('1. teste de mensagem', async () => {
    // let opt = { via: 'sms', locale: 'en', code_length: 6 };
    // let ret = await authy.verification_start('48999476823', '55', opt);
    // console.log(ret);
    let ret = await authy.verification_check('48999476823', '55', '858492');
    console.log(ret);
  });
});