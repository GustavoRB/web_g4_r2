"use strict";
const Session = require("./Session");
const BBPromise = require("bluebird");
const node_uuid = require("node-uuid");
const hub = require('../eventos/hub');

class SessionController {
  constructor() {
    this.sessionsMap = {};
    this.userSessionKeys = {};
    this.listeners = {
      'usuario.login': this.logar.bind(this),
    };
  }

  addSession(key, userId, rtc) {
    this.sessionsMap[key] = new Session.Session(key, userId, rtc);
    if (!this.userSessionKeys[userId]) {
      this.userSessionKeys[userId] = [];
    }
    this.userSessionKeys[userId].push(key);
    console.log('USUARIOS LOGADOS', this.userSessionKeys)
  }

  getSessaoByKey(key) {
    return this.sessionsMap[key];
  }

  static getInstance() {
    if (!SessionController.instance) {
      SessionController.instance = new SessionController();
    }
    return SessionController.instance;
  }

  destroyAsync() {
    return new Promise((resolve, reject) => {
      this.sessionsMap = null;
      this.userSessionKeys = null;
      SessionController.instance = null;
      this.destroy();
      resolve(true);
    });
  }

  logar(msg){

    return new BBPromise((resolve, reject) => {
      if (!username || !password) {
        return reject("Username and Password are required");
      }

      //tirar daqui, pra evitar 20mill listners
      //eventos.on('usuario.login', (msg) => {
      let user = {id:1};
      if(true /**sucesso*/ ) {
        console.log("aquii");
        let className = "rtcAdmin";
        let rtcClass = require("../rtc/" + className);
        try {
          let rtc = new rtcClass(socket);
          let key = node_uuid.v4();
          this.addSession(key, user.id, rtc);
          delete user.password;
          user.authenticationKey = key;
          console.log("aquii", 2222);
        }catch(e){
          console.error('errooo', e);
        }
      }
      return resolve(user);

      //rejeita a promessa se deu cagada, por exempplo senha incorreta
//        return reject(new Erro('senha incorreta')); cagada muito grande
      // });

      //eventos.emit('rtc.logar', {});
    });

  }

  login(msg) {

    hub.emit('rtc.loga', msg);

    //todo, aqui eu vou emitir para o manager verificar se o user pode passar.
  }

  wiring(){

    for (let name in this.listeners){
      if (this.listeners.hasOwnProperty(name)){
        hub.on(name, this.listeners[name]);
      }
    }

  }

}
exports.SessionController = SessionController;
