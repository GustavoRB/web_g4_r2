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

describe('Teste rtc_pesquisador', () => {
  before(function (done) {
    testManager = new TestManager(done);
  });

  let cliente = io(socketUrl);
  let pesquisador_logado = null;
  let fonte_selecionada = null;

  it('1. Pesquisador login incorreto', (done) => {

    cliente.on('connect', (data) => {

      let retorno_login = function (dado) {

        expect(dado.dados.success).to.be.false;
        expect(dado.dados.data).to.equal("Usuário não existe");
        expect(dado.evento_retorno).to.equal(msg.evento_retorno);


        cliente.removeListener('retorno', retorno_login);
        done();
      };

      cliente.on('retorno', retorno_login);

      let user = {
        login: 'não existe',
        senha: 'haynes',
      };

      let msg = {
        evento_retorno: 'login_incorreto',
        dados: user,
      };

      cliente.emit('logar', msg);
    });

    cliente.connect();

  });

  it('2. Pesquisador login senha incorreta', (done) => {

    let retorno_login = function (dado) {

      expect(dado.dados.success).to.be.false;
      expect(dado.dados.data).to.equal("Usuário e senha não batem");
      expect(dado.evento_retorno).to.equal(msg.evento_retorno);

      cliente.removeListener('retorno', retorno_login);
      done();
    };

    cliente.on('retorno', retorno_login);

    let user = {
      login: 'haynes',
      senha: 'naoexiste',
    };

    let msg = {
      evento_retorno: 'login_incorreto',
      dados: user,
    };

    cliente.emit('logar', msg);

  });

  /**
   * Created by Osvaldo
   *
   */
  it('3. Pesquisador login correto', (done) => {

    let retorno_login = function (dado) {

      expect(dado.dados.success).to.be.true;
      expect(dado.dados.data).to.be.instanceOf(Array);
      expect(dado.dados.data[0]).to.be.any.key('idioma', 'login', 'logado', 'numerocelular');
      expect(dado.dados.data[0].logado).to.be.true;
      expect(dado.evento_retorno).to.equal(msg.evento_retorno);

      pesquisador_logado = dado.dados.data[0];

      cliente.removeListener('retorno', retorno_login);
      done();
    };

    cliente.on('retorno', retorno_login);

    let user = {
      login: 'haynes',
      senha: 'haynes',
    };

    let msg = {
      evento_retorno: 'logado_sucesso',
      dados: user,
    };

    cliente.emit('logar', msg);

  });

  it('4. Pesquisador login error, já logado', (done) => {

    let logado_teste = io(socketUrl);

    logado_teste.on('connect', (data) => {

      let retorno_login = function (dado) {

        expect(dado.dados.success).to.be.false;
        expect(dado.dados.data).to.equal
        (messages.usuario.login.WANNA_LOGOUT);
        expect(dado.evento_retorno).to.equal(msg.evento_retorno);

        logado_teste.removeListener('retorno', retorno_login);
        logado_teste.disconnect();
        done();
      };

      logado_teste.on('retorno', retorno_login);

      let user = {
        login: 'haynes',
        senha: 'haynes',
      };

      let msg = {
        evento_retorno: 'login_incorreto',
        dados: user,
      };

      logado_teste.emit('logar', msg);

    });

    logado_teste.connect();

  });

  it('5. Le fontes do pesquisador logado', (done) => {

    let retorno_fontes_usuario = ((dado) => {

      expect(dado.dados.success).to.be.true;
      expect(dado.dados.data).to.be.instanceOf(Array);

      fonte_selecionada = dado.dados.data[0].fontes[0].fonte;

      cliente.removeListener('retorno', retorno_fontes_usuario);
      done();
    });

    cliente.on('retorno', retorno_fontes_usuario);

    let msg = {
      dados: pesquisador_logado.id,
      evento_retorno: 'le_fontes_pesquisador'
    };

    cliente.emit('le_fontes_pesquisador', msg);

  });

  it('6. Le semana do pesquisador', (done) => {

    let retorno_semana_pesquisador = ((dado) => {

      expect(dado.dados.success).to.be.true;
      cliente.removeListener('retorno', retorno_semana_pesquisador);
      done();
    });

    cliente.on('retorno', retorno_semana_pesquisador);

    let msg = {
      dados: {
        id_usuario: pesquisador_logado.id,
        id_fonte: fonte_selecionada.id
      },
      evento_retorno: 'read_semana_pesquisador'
    };

    cliente.emit('read_semana_pesquisador', msg);

  });

});