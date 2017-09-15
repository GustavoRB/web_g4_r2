const Basico = require('./basico_rtc');
const Open_handler = require('../handlers/open_usuario_handler');
const Rtc_admin = require('./principal/rtc_admin');

class login_rtc extends Basico {
  /**
   * Recebe o socketId passado pelo cliente.
   *
   * @param conf
   */
  constructor(conf) {
    super('login', Open_handler, conf);

    this.rtc_clientes = {
      admin: Rtc_admin,
    };

    this.interfaceListeners = {
      'logar': this.logar.bind(this),
      'fabricante_create': this.fabricante_create.bind(this),
    };

    this.wiring();
  }

  set rtc_clientes(rtc_clientes) {
    this._rtc_clientes = rtc_clientes;
  }

  get rtc_clientes() {
    return this._rtc_clientes;
  }

  /**
   * Repassa o pedido de login do cliente.
   * @param msg
   * @returns {Promise.<void>}
   */
  async logar(msg) {

    let dado = msg.dados;

    dado = await this.handler.logar(dado);

    if (!dado.success) {
      msg.dados = dado;
      this.emitprainterface(msg);
    }
    else {
      msg.dados = dado;
      this.trocar_rtc(msg);
    }
  }

  /**
   * Responsavel por criar o rtc para o tipo de funcionario.
   * @param dado
   */
  trocar_rtc(dado) {
    new this.rtc_clientes.admin(this.config, dado, this);
  }

  async fabricante_create(msg){
    msg.dados = await this.handler.fabricante_create(msg.dados);
    this.emitprainterface(msg);
  }

}

module.exports = login_rtc;