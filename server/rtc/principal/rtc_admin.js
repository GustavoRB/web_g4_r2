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
    request
      .get(url)
      .on('error', function(err) {
        console.log('err', err)
      })
      .on('response', function(response) {
        console.log('res', response.statusCode);
        console.log('res', response.data);
        console.log('res', response['content-type']);
        console.log(response);
      })

  }

  async product_save(msg){
    msg.dados = await this.handler.product_save(msg.dados);
    this.emitprainterface(msg);
  }

}

module.exports = rtc_admin;