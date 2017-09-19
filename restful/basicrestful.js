'use strict';

const Source = require('../eventos/source');
const SessionController = require("../authentication/SessionController");

class basicrestful extends Source {

  constructor(router, handler) {
    super();
    this.handler = handler;
    this.router = router;
    this.sessionController = SessionController.SessionController.getInstance();
  }

  set router(router) {
    if (!router) {
      throw new Error('Toda api deve conter o router');
    }

    this._router = router;
  }

  get router() {
    return this._router;
  }

  set sessionController(sessionController) {
    this._sessionController = sessionController;
  }

  get sessionController() {
    return this._sessionController;
  }

  set handler(handler) {
    if (!handler) {
      throw new Error("Toda a interface de comunicação deve ter seu handler");
    }

    this._handler = new handler();
  }

  get handler() {
    return this._handler;
  }

  /**
   * Responsavel por ligar as requisicoes get.
   *
   * @param rotas
   */
  wiringget(rotas) {
    for (let name in rotas) {
      if (rotas.hasOwnProperty(name)) {
        this.router.route(name).get(rotas[name]);
      }
    }
  }

  /**
   * Responsavel por ligar as requisicoes post.
   *
   * @param rotas
   */
  wiringpost(rotas) {
    for (let name in rotas) {
      if (rotas.hasOwnProperty(name)) {
        this.router.route(name).post(rotas[name]);
      }
    }
  }

  /**
   * Responsavel por ligar as requisicoes put.
   *
   * @param rotas
   */
  wiringput(rotas) {
    for (let name in rotas) {
      if (rotas.hasOwnProperty(name)) {
        this.router.route(name).put(rotas[name]);
      }
    }
  }

  /**
   * Responsavel por ligar as requisicoes delete.
   *
   * @param rotas
   */
  wiringdelete(rotas) {
    for (let name in rotas) {
      if (rotas.hasOwnProperty(name)) {
        this.router.route(name).delete(rotas[name]);
      }
    }
  }

  /**
   * Liga as rotas as funções, simulando o evento.
   */
  wiring() {
    for (let name in this.rotas) {
      if (this.rotas.hasOwnProperty(name) && this.rotas[name]) {
        let method = 'wiring' + name;
        this[method](this.rotas[name]);
      }
    }
  }
}

module.exports = basicrestful;