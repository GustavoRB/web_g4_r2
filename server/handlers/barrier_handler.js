const Basic_handler = require('./basic_handler');
const Objeto_pesquisa = require('./util_handler/objeto_pesquisa');

class Barrier_handler extends Basic_handler {

  async verifica_user_e_logado(id_user){

    let query = {_id: id_user};

    let pesquisa_user = new Objeto_pesquisa(query);

    let ret = await this.emitServer('db.cliente.read', pesquisa_user);

    let usuario_retorno = await this.retornaPadraoSucessData(ret.data);

    if(!usuario_retorno.issuccess){

      usuario_retorno.issuccess = false;
      return usuario_retorno;

    }else if (usuario_retorno.data.length < 1) {

      usuario_retorno.issuccess = false;
      usuario_retorno.data = "Authentication-key é invalida.";

    } else if(!usuario_retorno.data[0].logado){

      usuario_retorno.issuccess = false;
      usuario_retorno.data = "Efetue o login para continuar.";

    }

    return usuario_retorno;

  }

}

module.exports = Barrier_handler;