'use strict';

const hub = require('../eventos/hub');
const Restfuls = {
  usuario_restful: require('./apis/open_usuario_restiful'),
};

const Source = require('../eventos/source');

/**
 * Inicia todos os restfulls.
 */
class InitRestful extends Source {

  constructor(router) {
    super();
    this.hub = hub;
    this.restifuls = Restfuls;

    for (let restful in this.restifuls) {
      if (this.restifuls.hasOwnProperty(restful)) {
        new this.restifuls[restful](router);
      }
    }

    process.nextTick(() => {
      this.hub.send(this, 'restfuls.ready', {success: null, error: null});
    });
  }
}

module.exports = InitRestful;