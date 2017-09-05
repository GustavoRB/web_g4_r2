'use strict';
const Source = require('../eventos/source');

class BasicRtc extends Source {

  constructor(rtcNome, handler, config) {
    super();
    this.handler = handler;
    this.config = config;
    this.socket = this.config.socket;

    // Todo, temporario...
    console.log('conectado no rtc', rtcNome);
  }

  set interfaceListeners(interfaceListeners){
    this._interfaceListeners = interfaceListeners;
  }

  get interfaceListeners(){
    return this._interfaceListeners;
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

  set config(config){
    this._config = config;
  }

  get config(){
    return this._config;
  }

  set socket(socket) {
    this._socket = socket;
  }

  get socket() {
    return this._socket;
  }

  /**
   * Recebe a solicitacao de logout e encaminha para ser tratado.
   * @param msg
   * @returns {Promise.<void>}
   */
  async logout(msg) {

    let id_usuario = msg.dados;

    msg.dados = await
      this.handler.logout(id_usuario);

    this.emitprainterface(msg);
  }

  /**
   * Funcao responsavel por passar para o cliente o retorno dos pedidos dele.
   * @param dado
   */
  emitprainterface(dado) {
    this.socket.emit('retorno', dado);
  }

  /**
   * Destroy o objeto, desconectando ele de todos os eventos.
   */
  destroy() {

    for(let event in this.interfaceListeners){
      if(this.interfaceListeners.hasOwnProperty(event)){
        this.socket.removeListener(event, this.interfaceListeners[event]);
      }
    }

  }

  /**
   * Liga os eventos do interfaceListeners no socket.
   */
  wiring() {
    this.interfaceListeners['disconnect'] = this.destroy.bind(this);

    for (let name in this.interfaceListeners) {
      if (this.interfaceListeners.hasOwnProperty(name)) {
        this.socket.on(name, this.interfaceListeners[name]);
      }
    }
  }

}


module.exports = BasicRtc;