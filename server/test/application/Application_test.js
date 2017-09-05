'use strict';

const path = require('path');
const chai = require('chai');
const chaihttp = require('chai-http');
const HttpStatus = require('http-status-codes');
const TestManager = require('../TestManager');

chai.use(chaihttp);

let should = chai.should();
let expect = chai.expect;


// const SocketMocha = require('./../socketMock');
//
// const RTCLogin = require('../../rtc/rtcLoginManager');

let app = null;
let testManager = null;

describe('Teste da aplicacao', () => {
	before(function(done) {
		testManager = new TestManager(done);
	});


	it('meu primeiro teste', (done) => {
		done();
	});


	after((done) => {
		done();
	});
});



