let Util = require('../../util/util');
let Manager = require('./Manager');
let model = require('../model/Usuario');
const messages = require('../../util/messages.json').usuario;

class Usuario extends Manager {
  wireCustomListeners() {
    this.hub.on("db." + this.event_name + ".login", this.login.bind(this));
    // this.hub.on('usuarios_alfa_ordem.read', this.handlerReadUsuariosAlfaOrdem.bind(this));
  }

  // async handlerReadUsuariosAlfaOrdem(msg) {
  //   if (msg.source_id === this.id) return;
  //
  //   this.readUsuariosAlfaOrdem(msg.data.success)
  //     .then((ret) => {
  //       // for (let i = 0; i < ret.length; i++) {
  //       //   ret[i] = ret[i].toJSON();
  //       //   ret[i].usuario = ret[i].usuario.toString();
  //       // }
  //       this.customAnswer(msg.id, msg.event, ret, null);
  //     }).catch((error) => {
  //     this.customAnswer(msg.id, msg.event, null, error);
  //   });
  // }

  // /**
  //  *
  //  * @param msg
  //  * @returns {Promise.<void>}
  //  */
  // async readUsuariosAlfaOrdem(msg) {
  //   //TODO: TERMINAR
  //   let query = {'ativo': true};
  //   let sort = {nome: 'asc'};
  //   return await this.model.find(query)
  //     .sort(sort)
  //     .exec((err, res) =>{
  //     if(err){
  //       console.log(res);
  //     } else {
  //       console.log(res);
  //     }
  //     });
  // }

  async login(msg) {
    if (msg.source_id === this.id) return null;

    let data = msg.data.success;

    let usuario = await this.model.findOne({
      $or: [{login: data.login}, {numerocelular: data.login}]
    })
      .select("idioma login logado numerocelular senha tipo")
      .populate({
        path: 'idioma',
        select: 'nome locale',
      })
      .exec();

    if (!usuario) {
      this.answer(msg.id, "login", null, "Usuário não existe");
    } else if (usuario.senha !== data.senha) {
      this.answer(msg.id, "login", null, "Usuário e senha não batem");
    }
    //TODO: descomentar após funcao para deslogar de outro aparelho for implementada
    // else if (usuario.logado) {
    //   this.answer(msg.id, "login", null, messages.login.WANNA_LOGOUT);
    // }
    else {

      let user_atualizado = await this.model.findByIdAndUpdate(usuario.id, {logado: true}, {new: true});
      usuario = usuario.toJSON();
      usuario.logado = user_atualizado.logado;
      this.answer(msg.id, "login", [usuario], null);
      // OK
    }
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * model
   */
  get model() {
    return model;
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * nome
   */
  get event_name() {
    return 'usuario';
  }
}

module.exports = Usuario;