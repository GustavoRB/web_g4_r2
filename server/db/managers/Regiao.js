/**
 * Created by Lucas on 15/05/2017.
 */
let Manager = require('./Manager');
let _model = require('../model/Regiao');

class Regiao extends Manager {

  wireCustomListeners() {
    this.hub.on("read_regioes", this.handleReadRegioes.bind(this));
  }

  async handleReadRegioes(msg) {
    if (msg.source_id === this.id) return;

    this.readRegioes(msg.data.success)
      .then((ret) => {
        this.customAnswer(msg.id, msg.event, ret, null);
      }).catch((error) => {
      this.customAnswer(msg.id, msg.event, null, error);
    });
  }

  /**
   * Created by Thiago on 23/08/2017
   *
   * Lê as regiões do banco e ordena alfabeticamente.
   *
   * @param msg
   * @returns {Promise.<*>}
   */
  async readRegioes(msg) {
    return await this.model.find()
      .sort({nome: 'asc'})
      .exec((err, res) => {
        if(err){
          throw new Error('Erro no readRegioes');
        }
      });
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * model
   */
  get model() {
    return _model;
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * nome
   */
  get event_name() {
    return 'regiao';
  }
}

module.exports = Regiao;