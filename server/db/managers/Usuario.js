let Util = require('../../util/util');
let Manager = require('./Manager');
let model = require('../model/Usuario');
const messages = require('../../util/messages.json').usuario;

class Usuario extends Manager {
  wireCustomListeners() {
    this.hub.on("db." + this.event_name + ".login", this.login.bind(this));
  }

  async login(msg) {
    if (msg.source_id === this.id) return null;

    let data = msg.data.success;

    let usuario = await this.model.findOne({login: data.login})
      .select("nome login senha produtos")
      .exec();

    if (!usuario) {
      this.answer(msg.id, "login", null, "Usuário não existe");
    } else if (usuario.senha !== data.senha) {
      this.answer(msg.id, "login", null, "Usuário e senha não batem");
    }else {
      usuario = usuario.toJSON();
      delete usuario.senha;
      this.answer(msg.id, "login", [usuario], null);
    }
  }
  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * model
   */
  get model() {
    return model;
  }

  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * nome
   */
  get event_name() {
    return 'usuario';
  }
}

module.exports = Usuario;