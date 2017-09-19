const Source = require('../eventos/source');
const messages = require('../util/messages.json');
const Modal = require('./util_handler/objeto_modal');
const Botao = require('./util_handler/objeto_botao');

class Basic_handler extends Source {

  constructor() {
    super();
  }

  emitServer(event, dado) {
    return this.hub.send(this, event, {success: dado, error: null,}).promise;
  }

  /**
   * Created by Lucas on 16/06/2017
   *
   * Função cria a estrutura do modal baseado no modulo e na mensagem, para
   * mandar para o front
   * @param erros
   * @param estrutura_botoes
   * @param modulo
   */
  adicionaEstruturaDoModal(erros, estrutura_botoes, modulo) {

    let botoes = this.criaBotoes(estrutura_botoes);

    return new Modal(modulo, erros, botoes).formataParaBrowser();
  }

  /**
   * Created by Lucas on 19/06/2017
   *
   * Cria botões de acordo com a estrutura enviada, retorna os botões criados
   *
   * @param estrutura_botoes
   */
  criaBotoes(estrutura_botoes) {
    let botoes = [];
    for (let botao in estrutura_botoes) {
      botoes.push(new Botao(estrutura_botoes[botao].label,
        estrutura_botoes[botao].funcao));
    }
    return botoes;
  }

  /**
   * Created by Lucas on 22/05/2017
   *
   * Função deixa o retorno no padrão success e data, que são utilizados na
   * maior parte do sistema
   *
   * @param data
   * @param messages_model
   */
  retornaPadraoSucessData(data, messages_model) {

    let dado_tratado = {
      success: false,
      data: ''
    };

    if (!data.data.success) {
      //Se sucesso not true
      dado_tratado.data = this.atribuiMensagemErro(data._data, messages_model);
    }
    else {
      dado_tratado.success = true;
      dado_tratado.data = data.data.success;
    }
    return dado_tratado;
  }

  /**
   * Created by Thiago e Lucas on 02/08/2017
   *
   * Padroniza para success data quando o dado que deve ser retornado não vem diretamente do banco.
   *
   * @param data
   * @returns {{success: boolean, data: *}}
   */
  padronizaSuccessData(data){
    return {
      success: true,
      data: data
    };
  }

  /**
   * Created by Lucas on 22/05/2017
   *
   * Recebe o dado com erro e insere suas mensagens de erro padronizadas
   *
   * @param dado_com_erro
   * @param messages_model
   * @returns {Promise.<*>}
   */
  atribuiMensagemErro(dado_com_erro, messages_model) {

    if (dado_com_erro.error.name === "MongoError") {
      return this.errosMongoError(dado_com_erro, messages_model);
    }
    else if (dado_com_erro.error.name === "ValidationError") {
      return this.errosDeValidacao(dado_com_erro);
    }
    else if (messages_model === 'login') {
      return this.errosLogin(dado_com_erro);
    }
  }

  /**
   * Created by Lucas on 16/06/2017
   *
   * ramificação da função atribuiMensagemErro, para os erros de nome
   * 'MongoError'
   *
   * @param dado_com_erro
   */
  errosLogin(dado_com_erro) {
    return dado_com_erro.error;
  }

  /**
   * Created by Lucas on 31/05/2017
   *
   * ramificação da função atribuiMensagemErro, para os erros de nome
   * 'MongoError'
   *
   * @param dado_com_erro
   * @param messages_model
   * @returns {*}
   */
  errosMongoError(dado_com_erro, messages_model) {
    if (dado_com_erro.error.hasOwnProperty('code')) {
      let code = dado_com_erro.error.code;
      if (code === 11000) {
        dado_com_erro = messages[messages_model].DUPLICATED_KEY;
      }
      return dado_com_erro;
    }
  }

  /**
   * Created by Lucas on 31/05/2017
   *
   * ramificação da função atribuiMensagemErro, para os erros de nome
   * 'ValidationError'
   *
   * @param dado_com_erro
   * @returns {{}|*}
   */
  errosDeValidacao(dado_com_erro) {
    let campos_erro = {};

    for (let atributo in dado_com_erro.error.errors) {
      if (dado_com_erro.error.errors[atributo].hasOwnProperty('message')) {
        let path = dado_com_erro.error.errors[atributo].path;
        campos_erro[path] = dado_com_erro.error.errors[atributo].message;
      }
    }

    dado_com_erro = campos_erro;
    return dado_com_erro;
  }

  async retornopromises(msgs) {
    let retorno = {
      success: [],
      error: [],
    };

    for (let index = 0; index < msgs.length; index++) {
      if (msgs[index]._data.success) {
        retorno.success.push(new this.clienteretorno(true,
          msgs[index]._data.success))
      } else {
        retorno.error.push(new this.clienteretorno(true,
          msgs[index]._data.error))
      }
    }

    return retorno;
  }
}

module.exports = Basic_handler;