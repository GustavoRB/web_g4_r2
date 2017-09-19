
const EventEmitter2 = require('eventemitter2').EventEmitter2;
const Mensagem = require('../eventos/mensagem');

class socketMock extends EventEmitter2 {

  constructor() {
    super();

    this.id = 'hgffgugghgjghhgjgfu';
    this.mensagem = Mensagem;
  }

  emmitirMensagem(evt, data) {
    let msg = new this.mensagem(); // Todo
    this.emit(evt, msg);
  }

}

module.exports = socketMock;