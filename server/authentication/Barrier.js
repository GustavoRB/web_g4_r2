"use strict";

const Barrier_handler = require('../handlers/barrier_handler');
const httpStatus = require("http-status-codes");
class Barrier {
  constructor() {
    this.handler = new Barrier_handler();
  }

  set handler(handler) {
    this._handler = handler;
  }

  get handler() {
    return this._handler;
  }

  async validateKey(req, res, next) {

    if (req.path === "/api/login" ||
      req.path === "/favicon.ico" ||
      req.path.startsWith("/api/open/") ||
      req.path.startsWith("/resources/")) {
      return next();
    }
    let ref = req.headers["authentication-key"];

    if (ref) {
      let usuario_retorno = await this.handler.verifica_user_e_logado(ref);

      if (!usuario_retorno.issuccess) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send(usuario_retorno.data);
      }

      return next();

    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send("Sem authentication-key");
    }
  }
}
exports.Barrier = Barrier;