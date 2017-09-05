class SIOMLab{
  constructor(){
    this.socket = io;
    this.emiter = {
      wildcard: true,
      newListener: true,
      maxListeners: 200
    };
    this.messages_queue = {};

    this.wiring();
  }

  set socket(io){
    this._socket = io();
  }

  get socket(){
    return this._socket;
  }

  set emiter(configs){
    this._emiter = new EventEmitter2(configs);
  }

  get emiter(){
    return this._emiter;
  }

  set messages_queue(messages_queue){
    this._messages_queue = messages_queue;
  }

  get messages_queue(){
    return this._messages_queue;
  }

  set listeners(listeners){
    this._listeners = listeners;
  }

  get listeners(){
    return this._listeners;
  }

  on(event, callback){
    this.emiter.on(event, callback);
  }

  send_to_browser(evento, msg){
    this.emiter.emit(evento, msg);
  }

  remove_listener(evento, callback){
    this.emiter.removeListener(evento, callback);
  }

  message_to_send(msg){
    this.messages_queue[msg.id] = msg;
    return msg.to_server();
  }

  send_to_server(msg){
    let msg_to_server = this.message_to_send(msg);
    this.socket.emit(msg_to_server.evento, msg_to_server);
  }

  receive_from_server(msg){
    let msg_retorno = this.messages_queue[msg.id];
    delete this.messages_queue[msg.id];
    msg_retorno.dados = msg.dados;
    this.send_to_browser(msg_retorno.evento_retorno, msg_retorno);
  }

  wiring(){
    this.socket.on('retorno', this.receive_from_server.bind(this));
  }
}

window.SIOM = new SIOMLab();