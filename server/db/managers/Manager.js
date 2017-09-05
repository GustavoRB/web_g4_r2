'use strict';

const hub = require('../../eventos/hub');
const Source = require('../../eventos/source');

class Manager extends Source {
  constructor() {
    super();
    this.messages = require('../../util/messages.json');
    this.wiring();
  }

  //noinspection JSMethodCanBeStatic
  gerarMensagemErroPadrao(mensagem, evt, esperado, recebido) {
    return `Error: ${mensagem}
			      Evento: ${evt}
					  Esperado: ${esperado}
					  Recebido: ${recebido}`;
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Método chamado antes do create para fazer as operações necessárias com o(s)
   * dado(s) do(s) objeto(s) que será(ão) criado(s)
   *
   * @param data
   */
  async beforeCreate(data) {
    return data;
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Realiza operações necessárias
   *
   * @param data
   */
  async afterCreate(data) {
    for (let i = 0; i < data.length; i++) {
      data[i] = data[i].toJSON();
    }

    return data;
  }

  /**
   * Cria um novo documento no banco.
   *
   * @param data
   */
  async create(data)  {
    let dados = await this.beforeCreate(data);
    let ret = await this.model.create(dados);
    ret = ret instanceof Array ? ret : [ret];

    return await this.afterCreate(ret);
  }

  handleCreate(msg) {
    if (msg.source_id === this.id) return;

    this.create(msg.data.success)
      .then((ret) => {
      this.answer(msg.id, "create", ret, null);
    }).catch((error) => {
      console.error(error);
      this.answer(msg.id, "create", null, error);
    });
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Faz tratamentos necesários nos dados antes de executar o read
   *
   * @param data
   */
  async beforeRead(data) {
    return data;
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Faz as modificações/operações necessárias no retornaPadraoSucessData do read
   *
   * @param data
   */
  async afterRead(data) {
    for (let i = 0; i < data.length; i++) {
      data[i] = data[i].toJSON();
    }

    return data;
  }

  /**
   * Le um ou todos os documentos de uma determinada colecao no banco.
   *
   * @param data
   */
  async read(data) {
    let result = [];
    let limit = data.limit || 25;
    let page = data.page || 1;
    let select = data.select || '';
    let populate = data.populate || '';

    if (data.hasOwnProperty('_id')) {
      let ret = await this.model
        .findById(data._id)
        .select(select)
        .populate(populate)
        .exec();

      if (ret) result.push(ret);
    } else {
      let read_query = await this.beforeRead(data.query);

      let query = this.model
        .find(read_query)
        .limit(limit)
        .select(select)
        .populate(populate)
        .skip(limit * (page - 1));

      result = await query.exec();
    }

    return await this.afterRead(result);
  }

  handleRead(msg) {
    if (msg.source_id === this.id) return;

    this.read(msg.data.success)
      .then((ret) => {
      this.answer(msg.id, "read", ret, null);
    }).catch((error) => {
      this.answer(msg.id, "read", null, error);
    });
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Faz verificações e/ou operações necessárias com os dados recebidos para
   * update
   *
   * @param data
   */
  async beforeUpdate(data) {
    return data;
  }

  //noinspection JSMethodCanBeStatic
  async afterUpdate(data) {
    for (let i = 0; i < data.length; i++) {
      data[i] = data[i].toJSON();
    }

    return data;
  }

  /**
   * Modifica um documento em uma determinada colecao.
   *
   * @param data
   */
  async update(data) {
    let result = null;
    if (data.query._id) {
      let options = {
        new: true,
      };
      result = [await this.model.findByIdAndUpdate(data.query._id, data.update, options)];
    } else {
      let dados = await this.beforeUpdate(data);
      result = await this.model.update(dados.query, dados.update);
    }

    return await this.afterUpdate(result);
  }

  async handleUpdate(msg) {
    if (msg.source_id === this.id) return;

    this.update(msg.data.success).then((ret) => {
      this.answer(msg.id, "update", ret, null);
    }).catch((error) => {
      this.answer(msg.id, "update", null, error);
    });
  }

  //noinspection JSMethodCanBeStatic
  async beforeDelete(data) {
    return data;
  }

  //noinspection JSMethodCanBeStatic
  async afterDelete(result) {
    return result;
  }

  //noinspection ReservedWordAsName
  /**
   * Destroi um documento em uma determinada colecao.
   *
   * @param data
   */
  async delete(data) {
    let result = null;

    if (data._id) {
      result = await this.model.findByIdAndRemove(data._id);
    } else {
      let dados = await this.beforeDelete(data);
      result = await this.model.remove(dados);
    }

    return await this.afterDelete(result, data)
  }

  handleDelete(msg) {
    if (msg.source_id === this.id) return;

    this.delete(msg.data.success).then((ret) => {
      this.answer(msg.id, "delete", ret, null);
    }).catch((error) => {
      this.answer(msg.id, "delete", null, error);
    });
  }

  /**
   * Função para responder a mensagem
   *
   * @param id_mensagem
   * @param evento
   * @param success
   * @param error
   */
  answer(id_mensagem, evento, success, error) {
    let dados = {
      success: success,
      error: error
    };

    this.hub.send(this, "db." + this.event_name + "." + evento, dados, id_mensagem);
  }

  customAnswer(id_mensagem, evento, success, error) {
    let dados = {
      success: success,
      error: error
    };

    this.hub.send(this, evento, dados, id_mensagem);
  }

  /**
   * Funcao responsavel por ligar os eventos escutados por esse documento.
   */
  wiring() {
    this.hub.on("db." + this.event_name + ".create", this.handleCreate.bind(this));
    this.hub.on("db." + this.event_name + ".read", this.handleRead.bind(this));
    this.hub.on("db." + this.event_name + ".update", this.handleUpdate.bind(this));
    this.hub.on("db." + this.event_name + ".delete", this.handleDelete.bind(this));
    this.wireCustomListeners();
  }

  /**
   * Método a ser implementado nas subclasses que ouvirem eventos fora do CRUD
   */
  wireCustomListeners() {

  }

  //noinspection JSMethodCanBeStatic
  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * model
   */
  get model() {
    throw new Error("Precisa implemenar getModel na subclasse");
  }

  //noinspection JSMethodCanBeStatic
  /**
   * Deve ser implementado em todas as subclasses para retornar seu devido
   * nome
   */
  get event_name() {
    throw new Error("Precisa implementar getEventName na subclasse");
  }
}

module.exports = Manager;