'use strict';

const path = require('path');
const express = require('express');
const app = express();
const router = express.Router();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const busboy = require('connect-busboy');
const bodyParser = require('body-parser');
const Banco = require('./db/Banco');
const Login_rtc = require('./rtc/login_rtc');
const restfuls = require('./restful/');
const Source = require('./eventos/source');
const RotinaCriacaoSemanasEMeses = require('./RotinaCriacaoSemanasEMeses');

const Barrier = require('./authentication/Barrier').Barrier;

const cors = require('cors');

const Hub = require('./eventos/hub.js');

class Aplicacao extends Source{
  constructor(pathConfig) {
    super();
    this.config = require(pathConfig);
    this.app = app;
    this.http = http;
    this.io = io;
    this.barrier = new Barrier();

    this.app.set('view engine', 'ejs');
    this.app.set('views', path.resolve(__dirname + '/views'));
    this.app.use(express['static'](path.resolve('../browser')));

    this.app.use(busboy());
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(this.barrier.validateKey.bind(this.barrier));

    this.io.on('connection', Aplicacao.connection.bind(this));

    this.http.listen(this.config.server.porta, (err) => {
      this.hub.on('error.**', function() {
        console.log('algo feio aconteceu');
      });

      this.hub.on('banco.ready', function(err, a) {
        new restfuls(router);
      });

      this.hub.on('restfuls.ready', () => {
        this.app.use('/api', router);
        console.log(`Rodando na porta ${this.config.server.porta} \n`);
        this.hub.send(this, 'app.ready', {success: null, error: null});
      });

      this.banco = new Banco(this.config.db);
      RotinaCriacaoSemanasEMeses.start();
    });

    this.app.use('/image', express.static(path.resolve(__dirname + '/image/')));
    this.app.use('/favicon.ico',
      express.static(path.resolve(__dirname + '/favicon.ico'))
    );
  }

  static connection(socket) {
    new Login_rtc({socket: socket});
  }

  async destroy() {
    return await this.banco.destroy();
  }
}

module.exports = Aplicacao;