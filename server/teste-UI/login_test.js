'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
chai.use(chaiHttp);
var expect = chai.expect;
var should = chai.should();

Feature('Login');

Scenario('Create new USER', function(I) {
  I.amOnPage('/');
  
  I.see('Email:');


  I.fillField('input[name="login"]', 'root');
  I.fillField('input[name="senha"]', 'root');

  I.click('Logar');

  I.see('Signed in as root');

  pause();
  

});





