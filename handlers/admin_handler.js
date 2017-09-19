const BasicHandler = require('./basic_handler');
const UpdateObject = require('./util_handler/objeto_update');
const util = require('../util/util');

class Admin_handler extends BasicHandler {
  async product_save(data){
    let query = {
      _id: data.user_id,
    };
    let update = {
        produtos: data.products,
    };
    let ret = await this.emitServer('db.usuario.update', new UpdateObject(query, update));
    return {
      success: true,
      data: ret.data.success,
    };
  }
}

module.exports = Admin_handler;