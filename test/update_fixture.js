'use strict';

const chai = require('chai');
const chaihttp = require('chai-http');
const TestManager = require('./TestManager');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;

chai.use(chaihttp);

let testManager = null;

describe('Teste de manager país', () => {
  before(function(done) {
    testManager = new TestManager(done);
  });

  after(async function() {
    await testManager.destroy();
  });

  it('1. popula banco', (done) => {
    let file = require('../fixtures/Produto.json');

    for (let i = 0; i < file.data.length; i++) {
      let config = file.data[i].config;
      config.tempo_preparo = config.tempo_preparo / Math.pow(60, 6);
    }

    fs.writeFile("./fixtures/Produto.json", JSON.stringify(file), done);
  });
});