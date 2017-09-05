const Basico = require('./basico_rtc');
const Open_handler = require('../handlers/open_usuario_handler');
const Rtc_admin = require('./principal/rtc_admin');
const Rtc_pesquisador = require('./principal/rtc_pesquisador');

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
      pesquisador: Rtc_pesquisador
    };

    this.interfaceListeners = {
      'logar': this.logar.bind(this),
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

    let rtc_tipo = dado.dados.data[0].hasOwnProperty('tipo')
      ? dado.dados.data[0].tipo : 'pesquisador';
    new this.rtc_clientes[rtc_tipo](this.config, dado, this);

  }
}

module.exports = login_rtc;