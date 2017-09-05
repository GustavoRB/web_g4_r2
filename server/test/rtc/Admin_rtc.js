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
  let fonte_editar = null;

  let usuario_update = null;
  let admin_logado = null;
  let fonte_selecionada = null;

  it('1. Admin login incorreto', (done) => {

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
        senha: 'admin',
      };

      let msg = {
        evento_retorno: 'login_incorreto',
        dados: user,
      };

      cliente.emit('logar', msg);
    });

    cliente.connect();

  });

  it('2. Admin login senha incorreta', (done) => {

    let retorno_login = function (dado) {

      expect(dado.dados.success).to.be.false;
      expect(dado.dados.data).to.equal("Usuário e senha não batem");
      expect(dado.evento_retorno).to.equal(msg.evento_retorno);

      cliente.removeListener('retorno', retorno_login);
      done();
    };

    cliente.on('retorno', retorno_login);

    let user = {
      login: 'admin',
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
  it('3. Admin login correto', (done) => {

    let retorno_login = function (dado) {

      expect(dado.dados.success).to.be.true;
      expect(dado.dados.data).to.be.instanceOf(Array);
      expect(dado.dados.data[0]).to.be.any.key('idioma', 'login', 'logado', 'numerocelular', 'tipo');
      expect(dado.dados.data[0].logado).to.be.true;
      expect(dado.evento_retorno).to.equal(msg.evento_retorno);

      admin_logado = dado.dados.data[0];

      cliente.removeListener('retorno', retorno_login);
      done();
    };

    cliente.on('retorno', retorno_login);

    let user = {
      login: 'admin',
      senha: 'admin',
    };

    let msg = {
      evento_retorno: 'logado_sucesso',
      dados: user,
    };

    cliente.emit('logar', msg);

  });

  it('4. Admin login error, já logado', (done) => {

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
        login: 'admin',
        senha: 'admin',
      };

      let msg = {
        evento_retorno: 'login_incorreto',
        dados: user,
      };

      logado_teste.emit('logar', msg);

    });

    logado_teste.connect();

  });

  it('5. Admin Cadastro Usuario Correto', (done) => {

    let retorno_cadastro_usuario = function (dado) {

      expect(dado.dados.success).to.be.true;
      expect(dado.dados.data).to.be.instanceOf(Array);
      expect(dado.dados.data[0]).to.be.any.key('idioma', 'login', 'numerocelular',
        'tipo', 'nome');
      expect(dado.evento_retorno).to.equal(msg.evento_retorno);

      cliente.removeListener('retorno', retorno_cadastro_usuario);
      done();
    };

    cliente.on('retorno', retorno_cadastro_usuario);

    let usuario_novo = {
      nome: "Lucas da Silva Corrêa",
      login: "Lucas",
      senha: "lucas00",
      idioma: "58e00c05f796c980c33fbac0",
      numerocelular: "48984449760",
      datanascimento: new Date(),
      regiao: "58fa84bcfb3374281895fab5"
    };

    let msg = {
      evento_retorno: 'usuario_cadastro_sucesso',
      dados: usuario_novo
    };

    cliente.emit('cadastrausuario', msg);

  });

  it('6. Admin Cadastro Usuario Errado - Chave duplicada', (done) => {

    let retorno_cadastro_usuario_dupkey = function (dado) {

      expect(dado.dados.success).to.be.false;
      expect(dado.dados.data).to.be.equal(messages.usuario.DUPLICATED_KEY);
      expect(dado.evento_retorno).to.equal(msg.evento_retorno);

      cliente.removeListener('retorno', retorno_cadastro_usuario_dupkey);
      done();
    };

    cliente.on('retorno', retorno_cadastro_usuario_dupkey);

    let usuario_login_repetido = {
      nome: "Usuario Qualquer",
      login: "Lucas",
      senha: "qualquer",
      idioma: "58e00c05f796c980c33fbac0",
      numerocelular: "48984449760",
      datanascimento: new Date()
    };

    let msg = {
      evento_retorno: 'usuario_cadastro_erro',
      dados: usuario_login_repetido
    };

    cliente.emit('cadastrausuario', msg);

  });

  it('7. Admin Cadastro Usuario Errado - Campos Required em branco', (done) => {

    let retorno_cadastro_validate_errors_blank = function (dado) {

      expect(dado.dados.success).to.be.false;
      for (let atributo in dado.dados.data) {
        expect(dado.dados.data[atributo])
          .to.be.equal(messages.usuario[atributo].REQUIRED);
      }
      expect(dado.evento_retorno).to.equal(msg.evento_retorno);

      cliente.removeListener('retorno', retorno_cadastro_validate_errors_blank);
      done();
    };

    cliente.on('retorno', retorno_cadastro_validate_errors_blank);

    let usuario_campos_em_branco = {
      nome: "Usuario Qualquer"
    };

    let msg = {
      evento_retorno: 'usuario_cadastro_erro',
      dados: usuario_campos_em_branco
    };

    cliente.emit('cadastrausuario', msg);

  });

  it('8 Admin Le usuarios ativos', (done) => {

    let retorno_usuarios_ativos = ((dado) => {

      expect(dado.dados.success).to.be.true;
      expect(dado.dados.data).to.be.instanceOf(Array);
      expect(dado.dados.data[0]).to.be.any.key('login', 'regiao');
      expect(dado.dados.data[0].ativo).to.be.true;
      expect(dado.evento_retorno).to.equal(msg.evento_retorno);

      usuario_update = dado.dados.data[0];

      cliente.removeListener('retorno', retorno_usuarios_ativos);
      done();
    });

    cliente.on('retorno', retorno_usuarios_ativos);

    let msg = {
      evento_retorno: 'usuarios_ativos_readed',
      dados: {}
    };

    cliente.emit('usuarios_ativos_read', msg);

  });

  it('9. Admin Le usuario pelo id', (done) => {

    let retorno_usuario = ((dado) => {

      expect(dado.dados.success).to.be.true;
      expect(dado.dados.data).to.be.instanceOf(Array);
      expect(dado.dados.data[0]).to.be.any.key('login', 'nome');
      expect(dado.evento_retorno).to.equal(msg.evento_retorno);

      cliente.removeListener('retorno', retorno_usuario);
      done();
    });

    cliente.on('retorno', retorno_usuario);

    let msg = {
      evento_retorno: 'usuario_lido_sucesso',
      dados: {
        _id: usuario_update.id
      }
    };

    cliente.emit('read_usuario_pelo_id', msg);

  });

  it('10. Admin Edita usuario - mudando login para um ja existente', (done) => {

    let retorno_usuario_atualizado = ((dado) => {

      expect(dado.dados.success).to.be.false;
      expect(dado.dados.data).to.be.equal(messages.usuario.DUPLICATED_KEY);
      expect(dado.evento_retorno).to.equal(msg.evento_retorno);

      cliente.removeListener('retorno', retorno_usuario_atualizado);
      done();
    });

    cliente.on('retorno', retorno_usuario_atualizado);

    let msg = {
      evento_retorno: 'usuario_update_incorreto',
      dados: {
        _id: usuario_update.id,
        login: 'haynes'
      }
    };

    cliente.emit('usuario_update', msg);
  });

  it('11. Admin Edita usuario - correto', (done) => {

    let retorno_usuario_atualizado = ((dado) => {

      expect(dado.dados.success).to.be.true;
      expect(dado.dados.data).to.be.instanceOf(Array);
      expect(dado.dados.data[0]).to.be.any.key('nome', 'login');

      cliente.removeListener('retorno', retorno_usuario_atualizado);
      done();
    });

    cliente.on('retorno', retorno_usuario_atualizado);

    let msg = {
      evento_retorno: 'usuario_update_correto',
      dados: {
        _id: usuario_update.id,
        nome: 'Juca Pato'
      }
    };

    cliente.emit('usuario_update', msg);

  });

  it('12. Admin Remove usuario', (done) => {

    let retorno_usuario_removido = ((dado) => {

      expect(dado.dados.success).to.be.true;
      expect(dado.dados.data).to.be.instanceOf(Array);
      expect(dado.dados.data[0].ativo).to.be.false;
      expect(dado.evento_retorno).to.equal(msg.evento_retorno);

      cliente.removeListener('retorno', retorno_usuario_removido);
      done();
    });

    cliente.on('retorno', retorno_usuario_removido);

    let msg = {
      evento_retorno: 'usuario_removido_updated',
      dados: {
        _id: usuario_update.id,
      }
    };

    cliente.emit('usuario_remove_update', msg);
  });

  it('13. Admin Cadastrar Fonte - Atributos obrigatórios em branco', (done) => {

    let retorno_fonte_cadastrada_incorretamente = ((dado) => {

      expect(dado.dados.success).to.be.false;
      for (let atributo in dado.dados.data) {
        expect(dado.dados.data[atributo])
          .to.be.equal(messages.fonte[atributo].REQUIRED);
      }
      expect(dado.evento_retorno).to.equal(msg.evento_retorno);

      cliente.removeListener('retorno', retorno_fonte_cadastrada_incorretamente);
      done();
    });

    cliente.on('retorno', retorno_fonte_cadastrada_incorretamente);

    let msg = {
      evento_retorno: 'sucesso_cadastro_fonte',
      dados: {}
    };

    cliente.emit('cadastra_fonte', msg);
  });

  it('14. Admin Cadastrar Fonte - Correto', (done) => {

    let retorno_fonte_cadastrada = ((dado) => {

      expect(dado.dados.success).to.be.true;
      expect(dado.dados.data).to.be.instanceOf(Array);
      expect(dado.dados.data[0]).to.be.any.key('nome');
      expect(dado.evento_retorno).to.equal(msg.evento_retorno);

      fonte_editar = dado.dados.data[0];

      cliente.removeListener('retorno', retorno_fonte_cadastrada);
      done();
    });

    cliente.on('retorno', retorno_fonte_cadastrada);

    let msg = {
      evento_retorno: 'sucesso_cadastro_fonte',
      dados: {
        nome: "Giassi"
      }
    };

    cliente.emit('cadastra_fonte', msg);

  });

  it('15. Admin edita fonte - correto', (done) => {

    let retorno_fonte_editada = ((dado) => {

      expect(dado.dados.success).to.be.true;
      expect(dado.dados.data).to.be.instanceOf(Array);
      expect(dado.dados.data[0]).to.be.any.key('nome', 'endereco');
      expect(dado.evento_retorno).to.equal(msg.evento_retorno);

      cliente.removeListener('retorno', retorno_fonte_editada);
      done();
    });

    cliente.on('retorno', retorno_fonte_editada);

    let msg = {
      evento_retorno: "sucesso_edicao_fonte",
      dados: {
        _id: fonte_editar.id,
        endereco: {
          logradouro: "58e005d3ffcf33507786fa2c",
          numero: 114,
          complemento: "AP 302. BL.A"
        }
      }
    };

    cliente.emit('edita_fonte', msg);
  });


  it('16. Le fontes do pesquisador logado', (done) => {

    let retorno_fontes_usuario = ((dado) => {

      expect(dado.dados.success).to.be.true;
      expect(dado.dados.data).to.be.instanceOf(Array);

      fonte_selecionada = dado.dados.data[0].fontes[0].fonte;

      cliente.removeListener('retorno', retorno_fontes_usuario);
      done();
    });

    cliente.on('retorno', retorno_fontes_usuario);

    let msg = {
      dados: admin_logado.id,
      evento_retorno: 'le_fontes_pesquisador'
    };

    cliente.emit('le_fontes_pesquisador', msg);

  });

  it('17. Le meses disponíveis para pesquisa', (done) => {

    let retorno_meses_disponiveis_pesquisa = ((dado) => {

      expect(dado.dados.success).to.be.true;
      cliente.removeListener('retorno', retorno_meses_disponiveis_pesquisa);
      done();
    });

    cliente.on('retorno', retorno_meses_disponiveis_pesquisa);

    let msg = {
      evento_retorno: 'read_meses_disponiveis'
    };

    cliente.emit('read_meses_disponiveis', msg);

  });

  it('18. Le quantidade de semanas da fonte escolhida', (done) => {

    let retorno_quantidade_semanas_pesquisa= ((dado) => {

      expect(dado.dados.success).to.be.true;
      cliente.removeListener('retorno', retorno_pesquisa_semana);
      done();
    });

    cliente.on('retorno', retorno_quantidade_semanas_pesquisa);

    let msg = {
      dados: {
        mes: 8
      },
      evento_retorno: 'read_semanas_da_fonte'
    };

    cliente.emit('read_semanas_da_fonte', msg);

  });

  it('19. Le semana do admin logado', (done) => {

    let retorno_pesquisa_semana = ((dado) => {

      expect(dado.dados.success).to.be.true;

      cliente.removeListener('retorno', retorno_pesquisa_semana);
      done();
    });

    cliente.on('retorno', retorno_pesquisa_semana);

    let msg = {
      dados: {
        id_usuario: admin_logado.id,
        tipo_usuario: messages.admin,
        id_fonte: fonte_selecionada.id,
        mes: 6,
        semana: 1
      },
      evento_retorno: 'read_semana'
    };

    cliente.emit('read_semana', msg);

  });

  it('20. Cria novo mes de pesquisa', (done) => {

    let retorno_cria_novo_mes = ((dado) => {

      expect(dado.dados.success).to.be.true;

      cliente.removeListener('retorno', retorno_cria_novo_mes);
      done();
    });

    cliente.on('retorno', retorno_cria_novo_mes);

    let msg = {
      id_usuario: admin_logado.id
    };

    cliente.emit('reload_pesquisa', msg);


  });

  // it('21. Le pesquisa do pesquisador logado', (done) => {
  //
  //   let retorno_pesquisa_pesquisador = ((dado) => {
  //
  //     expect(dado.dados.success).to.be.true;
  //
  //     cliente.removeListener('retorno', retorno_pesquisa_pesquisador);
  //     done();
  //   });
  //
  //   cliente.on('retorno', retorno_pesquisa_pesquisador);
  //
  //   let msg = {
  //     dados: {
  //       id_usuario: admin_logado.id,
  //       id_fonte: fonte_selecionada.id
  //     },
  //     evento_retorno: 'read_pesquisa_pesquisador'
  //   };
  //
  //   cliente.emit('read_pesquisa_pesquisador', msg);
  //
  // });

  it('22. Salvar pesquisa', (done) => {

    let retorno_bobao = ((dado) => {
      cliente.removeListener('retorno', retorno_bobao);
      done();
    });

    cliente.on('retorno', retorno_bobao);

    let pesquisa = {
      _id: "594a78e6e47e19a1c1c2792a",
      usuario: "58fa84bcfb3374281895fab9",
      fonte: "592eca9ade5092116880dd99",
      semana: 3,
      save: true
    };

    let msg = {
      evento_retorno: 'pesquisa_inserida_sucesso',
      dados: pesquisa
    };

    cliente.emit('enviar_pesquisa', msg);

  });




});