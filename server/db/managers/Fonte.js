/**
 * Created by Lucas on 15/05/2017.
 */
let Manager = require('./Manager');
let model = require('../model/Fonte');

class Fonte extends Manager {

  //TODO: ERRO AO TENTAR LER O MODEL COM DISCRIMINATOR - LOOP INFINITO

  wireCustomListeners() {
    this.hub.on("read_fontes", this.handleReadFontes.bind(this));
  }

  async handleReadFontes(msg) {
    if (msg.source_id === this.id) return;

    this.readFontes(msg.data.success)
      .then((ret) => {
        this.customAnswer(msg.id, msg.event, ret, null);
      }).catch((error) => {
      this.customAnswer(msg.id, msg.event, null, error);
    });
  }

  /**
   * Created by Thiago on 25/08/2017
   *
   * Lê as fontes do banco e ordena alfabeticamente.
   *
   * @param msg
   * @returns {Promise.<*>}
   */
  async readFontes(msg) {
    let query = msg.query;
    return await this.model.find(query)
      .sort({nome: 'asc'})
      .exec((err, res) => {
        if(err){
          throw new Error('Erro no readFontes');
        }
      });
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * model
   */
  get model() {
    return model;
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * nome
   */
  get event_name() {
    return 'fonte';
  }
}

module.exports = Fonte;