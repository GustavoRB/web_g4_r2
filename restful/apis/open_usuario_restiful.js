'use strict';

const BasicRestful = require('../basicrestful');
const Open_handler = require('../../handlers/open_usuario_handler');
const httpStatus = require('http-status-codes');

class login_restiful extends BasicRestful {

  constructor(router) {
    super(router, Open_handler);

    this.rotas = {
      get: {
        '/open/login': this.login.bind(this),
        '/open/fabricantes': this.get_usuarios.bind(this),
      },
    };

    this.wiring();
  }

  set rotas(rotas){
    this._rotas = rotas;
  }

  get rotas(){
    return this._rotas;
  }

  /**
   * Responsavel por encaminhar o login
   *
   * @param req
   * @param res
   * @returns {Promise.<void>}
   */
  async login(req, res){
    let query = req.query;
    let ret = await this.handler.login(query.ref);

    return res.status(httpStatus.OK).send(ret);
  }

  async get_usuarios(req, res){
    let ret = await this.handler.get_usuarios();
    return res.status(httpStatus.OK).send(ret);
  }

}


module.exports = login_restiful;