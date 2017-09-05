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
      'cadastra_usuario': this.cadastraUsuario.bind(this),
      'logout': this.logout.bind(this),
      'usuarios_ativos_read': this.readUsuariosAtivos.bind(this),
      'remove_usuario': this.removeUsuario.bind(this),
      'usuario_update': this.updateUsuario.bind(this),
      'read_usuario_pelo_id': this.readUsuarioById.bind(this),
      'cadastra_fonte': this.cadastraFonte.bind(this),
      'le_fontes': this.readFontes.bind(this),
      'read_semana_admin': this.readSemanaAdmin.bind(this),
      'read_semanas_da_fonte': this.readSemanasDaFonte.bind(this),
      'edita_fonte': this.editaFonte.bind(this),
      'read_meses_disponiveis': this.readMesesDisponiveis.bind(this),
      'reload_pesquisa': this.reloadPesquisa.bind(this),
      'editar_pesquisador': this.editarPesquisador.bind(this),
      'salva_semana_admin': this.salvarPesquisa.bind(this),
      'read_pesquisadores_fonte': this.readPesquisadoresFonte.bind(this),
      'read_cidades': this.readCidades.bind(this),
      'read_regioes': this.readRegioes.bind(this),
      'read_fontes': this.readFontes.bind(this),
      'read_fontes_populate': this.readFontesPopulate.bind(this),
      'le_usuarios_ativos_alfa_ordem': this.readUsuariosAtivosAlfaOrdem.bind(this),
      'cadastra_regiao': this.cadastraRegiao.bind(this),
    };

    rtc_login.destroy();

    this.emitprainterface(dado);

    this.wiring();
  };

  async cadastraRegiao(msg) {
    msg.dados = await this.handler.cadastraRegiao(msg.dados);
    this.emitprainterface(msg);
  }

  async readCidades(msg) {
    msg.dados = await this.handler.readCidades();
    this.emitprainterface(msg);
  }

  async readRegioes(msg) {
    msg.dados = await this.handler.readRegioes();
    this.emitprainterface(msg);
  }

  /**
   * Recebe solicitação para retornar os usuários ordenados por ativos e ordem alfabética
   * @param msg
   * @returns {Promise.<void>}
   */
  async readUsuariosAtivosAlfaOrdem(msg){
    msg.dados = await this.handler.readUsuariosAtivosAlfaOrdem(msg.dados);
    this.emitprainterface(msg);
  }

  async readPesquisadoresFonte(msg) {
    msg.dados = await this.handler.readPesquisadoresFonte(msg.dados);
    this.emitprainterface(msg);
  }

  async editarPesquisador(msg) {
    msg.dados = await this.handler.updatePesquisador(msg.dados);
    this.emitprainterface(msg);
  }

  /**
   * Recebe a solicitação para retornar as semanas da fonte selecionada
   *
   * @param msg
   * @returns {Promise.<void>}
   */
  async readSemanasDaFonte(msg) {
    let mes = msg.dados.mes;

    msg.dados = this.handler.readSemanasDaFonte(mes);

    this.emitprainterface(msg);
  }

  /**
   * Created by Lucas on 10/07/2017
   * @param msg
   * @returns {Promise.<void>}
   */
  async reloadPesquisa(msg) {
    let id_usuario = msg.dados.id_usuario;

    msg.dados = this.handler.reloadPesquisa(id_usuario);

    this.emitprainterface(msg);
  }


  /**
   * Created by OLDS on 14/08/2017
   *
   * Recebe a solicitação de enviar ou salvar uma pesquisa
   *
   * @param msg
   * @returns {Promise.<void>}
   */
  async salvarPesquisa(msg) {

    msg.dados = await this.handler.salvarPesquisa(msg.dados);

    this.emitprainterface(msg);
  }

  /**
   * Created by Lucas on 20/06/2017
   *
   * Recebe a solicitacao de leitura da pesquisa do pesquisador
   *
   * @param msg
   * @returns {Promise.<void>}
   */
  async readSemanaAdmin(msg) {

    let usuario = {
      id: msg.dados.usuario.id,
      tipo: msg.dados.usuario.tipo
    };

    let id_fonte = msg.dados.fonte.id;

    let mes_e_semana = {
      mes: msg.dados.mes_e_semana.mes,
      semana: msg.dados.mes_e_semana.semana
    };

    msg.dados = await this.handler.readSemanaAdmin(usuario, id_fonte,
      mes_e_semana);

    this.emitprainterface(msg);
  }

  /**
   * Recebe a solicitação de leitura das fontes do pesquisador
   * @param msg
   * @returns {Promise.<void>}
   */
  async readFontes(msg) {

    msg.dados = await this.handler.readFontes();

    this.emitprainterface(msg);
  }

  /**
   * Created by Thiago on 25/08/2017
   *
   * Recebe a solicitação de leitura das fontes do pesquisador com popula no
   * usuário e produtos. Usado para mostrar os pesquisadores da fonte no gerenciador.
   *
   * @param msg
   * @returns {Promise.<void>}
   */
  async readFontesPopulate(msg) {

    msg.dados = await this.handler.readFontesPopulate();

    this.emitprainterface(msg);

  }

  /**
   * Created by Lucas on 26/05/2017
   *
   * Recebe a solicitação de edição de fonte existente
   *
   * @param msg
   * @returns {Promise.<void>}
   */
  async editaFonte(msg) {

    let id_fonte = msg.dados._id;

    let update = {};

    for (let atributo in msg.dados) {
      if (atributo !== "_id") {
        update[atributo] = msg.dados[atributo];
      }
    }

    msg.dados = await
      this.handler.editaFonte(id_fonte, update);

    this.emitprainterface(msg);
  }

  /**
   * Created by Thiago on 10/07/2017
   *
   * Recebe a solicitação de leitura dos meses disponíveis para pesquisa
   * (atual e anterior).
   *
   * @param msg
   * @returns {Promise.<void>}
   */
  async readMesesDisponiveis(msg) {

    msg.dados = this.handler.readMesesDisponiveis();

    this.emitprainterface(msg);

  }

  /**
   * Created by Lucas on 26/05/2017
   *
   * Recebe a solicitação de cadastro de uma nova fonte
   *
   * @param msg
   * @returns {Promise.<void>}
   */
  async cadastraFonte(msg) {

    let nova_fonte = msg.dados;

    msg.dados = await this.handler.cadastraFonte(nova_fonte);

    this.emitprainterface(msg);
  }

  /**
   * Created by Lucas on 25/05/2017
   *
   * Recebe a solicitação de ler apenas um usuario pelo id
   *
   * @param msg
   * @returns {Promise.<void>}
   */
  async readUsuarioById(msg) {

    let condicao = {_id: msg.dados._id};

    msg.dados = await
      this.handler.readUsuariosByCondicao(condicao);

    this.emitprainterface(msg);
  }

  /**
   * Created by Lucas
   *
   * Recebe a solicitação de ler todos os usuarios ativos
   *
   * @param msg
   * @returns {Promise.<void>}
   */
  async readUsuariosAtivos(msg) {

    let condicao = {ativo: true};

    msg.dados = await
      this.handler.readUsuariosByCondicao(condicao);

    this.emitprainterface(msg);
  }

  /**
   * Created by Lucas on 24/05/2017
   *
   * Recebe a solicitação de remover usuario
   *
   * @param msg
   * @returns {Promise.<void>}
   */
  async removeUsuario(msg) {

    let id_usuario = msg.dados.usuario_id;

    let update = {
      ativo: false
    };

    msg.dados = await this.handler.removeUsuario(id_usuario, update);

    this.emitprainterface(msg);
  }

  /**
   * Created by Lucas on 25/05/2017
   *
   * Recebe a solicitação de update usuario
   * Percorre os atributos do objeto enviado para formar o update
   *
   * @param msg
   * @returns {Promise.<void>}
   */
  async updateUsuario(msg) {

    let id_usuario = msg.dados._id;

    let update = {};

    for (let atributo in msg.dados) {
      if (atributo !== "_id") {
        let attr = atributo;
        update[attr] = msg.dados[atributo];
      }
    }

    msg.dados = await
      this.handler.updateUsuario(id_usuario, update);

    this.emitprainterface(msg);
  }

  /**
   * Created by Lucas on 17/05/2017
   *
   * Recebe a solicitação de cadastro de usuario e encaminha para ser tratado
   * @param msg
   * @returns {Promise.<void>}
   */
  async cadastraUsuario(msg) {

    let usuario_novo = msg.dados.usuario;

    msg.dados = await this.handler.cadastraUsuario(usuario_novo);

    this.emitprainterface(msg);
    //TODO: terminar
  }

}

module.exports = rtc_admin;