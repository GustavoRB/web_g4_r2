const Basico = require('../basico_rtc');
const Admin_handler = require('../../handlers/admin_handler');
const messages = require('../../util/messages.json');

class rtc_admin extends Basico {
  /**
   * Recebe o socketId passado pelo cliente.
   *
   * @param conf
   */
  constructor(conf, dado, rtc_login) {
    super('Admin', Admin_handler, conf);

    this.interfaceListeners = {
      'logout': this.logout.bind(this),
      'product_save': this.product_save.bind(this),
    };

    rtc_login.destroy();

    this.emitprainterface(dado);

    this.wiring();
  };

  async product_save(msg){
    msg.dados = await this.handler.product_save(msg.dados);
    this.emitprainterface(msg);
  }

}

module.exports = rtc_admin;