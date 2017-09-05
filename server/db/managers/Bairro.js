/**
 * Created by Lucas on 15/05/2017.
 */
let Manager = require('./Manager');
let _model = require('../model/Bairro');

class Bairro extends Manager {
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
    return 'bairro';
  }
}

module.exports = Bairro;