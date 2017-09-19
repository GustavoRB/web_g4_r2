'use strict';

const chai = require('chai');
const chaihttp = require('chai-http');
const TestManager = require('../TestManager');
const messages = require('../../util/messages.json');

chai.use(chaihttp);

let should = chai.should();
let expect = chai.expect;

let io = require('socket.io-client');
let socketUrl = 'http://localhost:1337';
let options = {
  transport: ['websocket'],
  'force new connection': true,
};

let testManager = null;

describe('Teste rtc_admin', () => {
  before(function (done) {
    testManager = new TestManager(done);
  });

  let cliente = io(socketUrl);
  let logado = null;

  it('connect', (done) => {
    let ret_connect = () => {
      done();
    };
    cliente.on('connect', ret_connect);
    cliente.connect();
  });

  it('criar novo fabricante', (done)=>{
    let retorno_fabricante_criado = (msg)=>{
      cliente.removeListener('retorno', retorno_fabricante_criado);
      done();
    };
    let data = {
      nome: 'novo fabricante',
      login: 'login',
      senha: 'senha',
    };
    cliente.on('retorno', retorno_fabricante_criado);
    cliente.emit('fabricante_create', {dados: data});
  });

  it('Login', (done) => {
    let retorno_login = function (dado) {
      expect(dado.dados.success).to.be.true;
      logado = dado.dados.data[0];
      cliente.removeListener('retorno', retorno_login);
      done();
    };
    cliente.on('retorno', retorno_login);
    let user = {
      login: 'gustavo',
      senha: 'gustavo',
    };
    let msg = {
      dados: user,
    };
    cliente.emit('logar', msg);
  });

  it('salva produto', (done)=>{
    let retorno_products_save = (msg)=>{
      cliente.removeListener('retorno', retorno_products_save);
      done();
    };
    cliente.on('retorno', retorno_products_save);
    let data = {
      user_id: logado.id,
      products: [
        {
          nome: "novo produto A",
          custo: 87.55
        },
        {
          nome: "novo produto B",
          custo: 11.92
        },
      ]
    };
    cliente.emit('product_save', {dados: data});
  });

});