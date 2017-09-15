const QueryObject = require('./util_handler/objeto_pesquisa');
const Basic_handler = require('./basic_handler');
const messages = require('../util/messages.json').usuario.login;

class Open_handler extends Basic_handler {

  /**
   * Verifica se usuario existe e efetua o login.
   *
   * @param dados_login
   * @returns {Promise}
   */
  async logar(dados_login) {

    let modulo = 'login';

    let ret = await this.emitServer('db.usuario.login', dados_login);

    ret = this.retornaPadraoSucessData(ret, modulo);

    if (ret.success) {
      return ret;
    }
    else {
      let estrutura_botoes;
      if(ret.data === messages.WANNA_LOGOUT){
        estrutura_botoes = messages.botoes.WANNA_LOGOUT;
      }
      else{
        estrutura_botoes = messages.botoes.ANOTHER_ERRORS;
      }
      ret.modal = this.adicionaEstruturaDoModal(ret.data,
        estrutura_botoes, modulo);
      return ret;
    }

  }

  async get_usuarios(){
    let select = 'nome produtos';
    let ret = await this.emitServer('db.usuario.read', new QueryObject(null, select));
    return {
      success: true,
      data: ret.data.success,
    };
  }

  async fabricante_create(dado){
    let ret = await this.emitServer('db.usuario.create', dado);
    return {
      success: true,
      data: ret.data.success,
    };
  }

}

module.exports = Open_handler;