let Manager = require('./Manager');
let _model = require('../model/Cidade');

class Cidade extends Manager {

  wireCustomListeners() {
    this.hub.on("read_cidades", this.handleReadCidades.bind(this));
  }

  async handleReadCidades(msg) {
    if (msg.source_id === this.id) return;

    this.readCidades(msg.data.success)
      .then((ret) => {
        this.customAnswer(msg.id, msg.event, ret, null);
      }).catch((error) => {
      this.customAnswer(msg.id, msg.event, null, error);
    });
  }

  /**
   * Created by Thiago on 23/08/2017
   *
   * Lê as cidades do banco e ordena alfabeticamente.
   *
   * @param msg
   * @returns {Promise.<*>}
   */
  async readCidades(msg) {
    return await this.model.find()
      .sort({nome: 'asc'})
      .exec((err, res) => {
        if(err){
          throw new Error('Erro no readCidades');
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
		return 'cidade';
	}

}

module.exports = Cidade;