/**
 * Created by Lucas on 15/05/2017.
 */
let Fonte = require('./Fonte');
let _model = require('../model/Fisica');

class Fisica extends Fonte {

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
    return 'fisica';
  }
}

module.exports = Fisica;