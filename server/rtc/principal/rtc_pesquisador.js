/**
 * Created by Lucas on 14/06/2017.
 */
const Basico = require('../basico_rtc');
const Pesquisador_handler = require('../../handlers/pesquisador_handler');

class rtc_pesquisador extends Basico {
  /**
   * Recebe o socketId passado pelo cliente.
   *
   * @param conf
   */
  constructor(conf, dado, rtc_login) {
    super('Pesquisador', Pesquisador_handler, conf);

    this.interfaceListeners = {
      'logout': this.logout.bind(this),
      'le_fontes_pesquisador': this.readFontesPesquisador.bind(this),
      'read_semana_pesquisador': this.readSemanaPesquisador.bind(this),
      'salva_semana_pesquisador': this.salvaSemanaPesquisador.bind(this),
      // 'insere_pesquisa': this.inserePesquisa.bind(this),
    };

    rtc_login.destroy();

    this.emitprainterface(dado);

    this.wiring();
  }

  /**
   * Created by Lucas on 03/08/2017
   * Recebe objeto mensagem com parâmetros usuário e produtos
   * @param msg
   * @returns {Promise.<void>}
   */
  async salvaSemanaPesquisador(msg){
    let usuario = msg.dados.usuario;
    let produtos = msg.dados.produtos;
    let fonte = msg.dados.fonte;

    msg.dados = await this.handler.salvaSemanaPesquisador(usuario, produtos, fonte);

    this.emitprainterface(msg);
  }

  async readFontesPesquisador(msg) {

    let id_usuario = msg.dados;

    msg.dados = await this.handler.readFontesPesquisador(id_usuario);

    this.emitprainterface(msg);
  }

  async readSemanaPesquisador(msg) {

    let id_usuario = msg.dados.id_usuario;
    let id_fonte = msg.dados.id_fonte;

    msg.dados = await this.handler.readSemanaPesquisador(id_usuario, id_fonte);
    this.emitprainterface(msg);

  }

}

module.exports = rtc_pesquisador;