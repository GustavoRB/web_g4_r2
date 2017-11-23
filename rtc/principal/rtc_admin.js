const Basico = require('../basico_rtc');
const Admin_handler = require('../../handlers/admin_handler');
const messages = require('../../util/messages.json');
const request = require("request");

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
      'request_products': this.request_products.bind(this)
    };

    rtc_login.destroy();

    this.emitprainterface(dado);

    this.wiring();
  };

  async request_products(msg) {

    let url = 'https://ine5646products.herokuapp.com/api/products';
    request(url, (error, response, body) => {
      if(error || response.statusCode === 404) {
        msg.dados = {
          success: false,
          data: 'não foi possível se conectar ao microserviço de produtos, tente novamente mais tarde!'
        };
      } else {
        msg.dados = {
          success: true,
          data: JSON.parse(body),
        };
      }
      this.emitprainterface(msg);
    });

  }

  async product_save(msg){
    msg.dados = await this.handler.product_save(msg.dados);
    this.emitprainterface(msg);
  }

}

module.exports = rtc_admin;