'use strict';

const koa = require('koa-router')();
const app = new (require('koa'))();
const views = require('koa-views');
const koa_static = require('koa-static');

class Aplicacao{
  constructor(pathConfig) {
    this.config = require(pathConfig);
    this.app = app;

    this.app.use(require('koa-bodyparser')());
    this.app.use(koa_static('../browser'));
    this.app.listen(this.config.server.porta);
  }
}

module.exports = Aplicacao;