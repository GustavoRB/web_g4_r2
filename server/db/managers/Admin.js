let Usuario = require('./Usuario');
let _model = require('../model/Admin');

class Admin extends Usuario {
  wireCustomListeners() {
    super.wireCustomListeners();
  }
  //noinspection JSMethodCanBeStatic
  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * model
   */
  get model() {
    return _model;
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * nome
   */
  get event_name() {
    return 'admin';
  }
}

module.exports = Admin;