/**
 * Created by Lucas on 14/06/2017.
 */
const Basic_handler = require('./basic_handler');
const Objeto_update = require('./util_handler/objeto_update');
const Objeto_read = require('./util_handler/objeto_pesquisa');
const RegraMudouEspec = require('../util/RegraMudouEspec');
const messages = require('../util/messages.json');
const xlsx2json = require('xlsx2json');
const path = require('path');
const util = require('../util/util');
const FuncoesData = require('../util/FuncoesData');
const FuncoesMap = require('../util/FuncoesMap');

class Pesquisador_handler extends Basic_handler {

  /**
   * Created by Thiago on 10/07/2017
   *
   * Retorna os meses disponíveis para ser feita a pesquisa (atual e anterior).
   *
   */
  readMesesDisponiveis() {
    let data_atual = new Date();
    let mes_atual = data_atual.getMonth() + 1;
    let mes_anterior = mes_atual;
    if(data_atual.getDate() > FuncoesData.getUltimaSexta(data_atual.getMonth(),
        data_atual.getFullYear())){
      mes_atual = mes_atual + 1 === 13 ? 1 : mes_atual + 1;
      mes_anterior = mes_atual - 1 === 0 ? 12 : mes_atual - 1;
    }

    let meses_disponiveis = {
      mes_anterior: mes_anterior,
      mes_atual: mes_atual
    };

    return this.padronizaSuccessData(meses_disponiveis);
  }

  /**
   * TODO: COMENTAR BREZA
   * @param mes_recebido
   * @returns {{success: boolean, data: *}}
   */
  readSemanasDaFonte(mes_recebido) {
    let data_atual = new Date();
    if(data_atual.getDate() > FuncoesData.getUltimaSexta(data_atual.getFullYear(),
        data_atual.getMonth())) FuncoesData.setProximoMes(data_atual);
    if(mes_recebido < data_atual.getMonth() + 1){
      let ano_pesquisa = mes_recebido > data_atual.getMonth() + 1 ? data_atual.getFullYear() - 1 :
        data_atual.getFullYear();
      let data_pesquisa = new Date(ano_pesquisa, mes_recebido, 0);
      let ultimo_dia_do_mes = data_pesquisa.getDate();
      let primeira_sexta = FuncoesData.getDiaPrimeiraSexta(data_pesquisa);
      return this.padronizaSuccessData(
        FuncoesData.getTotalDeSemanasMesAnterior(ultimo_dia_do_mes, primeira_sexta));
    } else {
      return this.padronizaSuccessData(FuncoesData.getSemanaAtual(data_atual));
    }

  }

  /**
   * Created by Lucas on 10/07/2017
   * @param id_usuario
   * @returns {Promise.<void>}
   */
  async reloadPesquisa(id_usuario) {

    let mes_atual = new Date().getMonth();

    let query = {'usuario': id_usuario, 'mes': mes_atual};

    let obj_read = new Objeto_read(query);

    let retorno = this.emitServer('db.pesquisa.read', obj_read);
  }

  /**
   *
   * Created by Lucas on 11/07/2017
   * @param id_usuario
   * @param id_fonte
   * @param mes_e_semana
   * @returns {Promise.<*>}
   */
  async readSemanaAdmin(usuario, id_fonte, mes_e_semana) {

    let mes = mes_e_semana.mes;
    let semana = mes_e_semana.semana;

    let data_atual = new Date();
    if(data_atual.getDate() > FuncoesData.getUltimaSexta(data_atual.getFullYear(),
        data_atual.getMonth())) FuncoesData.setProximoMes(data_atual);
    let ano = mes > data_atual.getMonth() + 1 ? data_atual.getFullYear() - 1 :
      data_atual.getFullYear();

    let query = {'usuario': usuario.id, 'ano': ano, 'mes': mes};

    let populate = {
      path: 'fontes.fonte fontes.semanas.produtos.produto',
      select: 'id nome tipo codigo'
    };

    let obj_read = new Objeto_read(query, null, populate);
    let retorno = await this.emitServer('db.pesquisa.read', obj_read);
    retorno = this.retornaPadraoSucessData(retorno, 'pesquisa');

    let pesquisa = retorno.data;

    if (pesquisa.length < 1) {
      // usuario não tem pesquisa
      let estrutura_botoes = messages.botoes.ANOTHER_ERRORS;
      retorno.modal = this.adicionaEstruturaDoModal(messages.pesquisa.SEM_PESQUISAS,
        estrutura_botoes, 'Pesquisa não encontrada');
      retorno.data = messages.pesquisa.SEM_PESQUISAS;
    }
    else {
      pesquisa = this.pegaPesquisaDaSemanaRequisitada(pesquisa, id_fonte,
        semana);
      // Se pesquisa tiver modal
      pesquisa.modal ? retorno = pesquisa : retorno.data = pesquisa;
    }

    this.insereInformacoesAnteriores(retorno.data);
    delete retorno.data.semana.semana_anterior;

    return retorno;
  }

  /**
   * Created by Thiago on 11/07/2017
   *
   * ...
   *
   * @param id_usuario
   * @param id_fonte
   * @returns {Promise.<*>}
   */
  async readSemanaPesquisador(id_usuario, id_fonte) {
    let semana_retorno = {
      semana: '',
      id_pesquisa: ''
    };

    let data_atual = new Date();
    let semana = FuncoesData.getSemanaAtual(data_atual);
    let query = {'usuario': id_usuario, 'ano': data_atual.getFullYear(),
      'mes': data_atual.getMonth() + 1};
    let populate = ({path: 'fontes.semanas.produtos.produto'});
    let obj_read = new Objeto_read(query, null, populate);
    let pesquisa = await this.emitServer('db.pesquisa.read', obj_read);
    pesquisa = pesquisa.data.success;
    semana_retorno.id_pesquisa = pesquisa[0].id;

    for (let j = 0; j < pesquisa[0].fontes.length; j++) {
      if (pesquisa[0].fontes[j].fonte.toString() === id_fonte) {
        for (let k = 0; k < pesquisa[0].fontes[j].semanas.length; k++) {
          if (pesquisa[0].fontes[j].semanas[k].numero === semana) {
            semana_retorno.semana = pesquisa[0].fontes[j].semanas[k];
          }
        }
      }
    }
    this.insereInformacoesAnteriores(semana_retorno);
    delete semana_retorno.semana.semana_anterior;
    semana_retorno = this.padronizaSuccessData(semana_retorno);

    if (!semana_retorno.data.semana) {
      throw new Error(messages.pesquisa.SEMANA_NAO_ENCONTRADA);
    }

    return semana_retorno;

  }

  /**
   * Created by Lucas on 22/06/2017
   *
   * Retorna a semana requisitada
   *
   * @param pesquisa
   * @param id_fonte
   * @param semana_requisitada
   */
  pegaPesquisaDaSemanaRequisitada(pesquisa, id_fonte, semana_requisitada) {

    let fonte_requisitada = this.pegaFontePeloId(id_fonte,
      pesquisa[0].fontes);
    if (fonte_requisitada.hasOwnProperty('modal')) {
      //Caso não encontre a fonte, retorna modal com o erro
      return fonte_requisitada;
    }
    else {
      return this.pegaPesquisaPelaSemana(pesquisa[0].id,
        fonte_requisitada.semanas, semana_requisitada);
    }

  }

  /**
   * Created by Lucas on 21/06/2017
   *
   * Pega a pesquisa de acordo com a semana selecionada
   *
   * @param semanas
   * @param semana_selecionada
   */
  pegaPesquisaPelaSemana(id_pesquisa, semanas, semana_selecionada) {
    for (let semana = 0; semana < semanas.length; semana++) {
      if (semanas[semana].numero === semana_selecionada) {
        return {
          semana: semanas[semana],
          id_pesquisa: id_pesquisa
        };
      }
    }
    //Semana não existente
    let estrutura_botoes = messages.botoes.ANOTHER_ERRORS;
    let modal = this.adicionaEstruturaDoModal(messages.pesquisa.SEMANA_VAZIA,
      estrutura_botoes, 'Semana Sem Dados');
    return {
      modal: modal,
      data: messages.pesquisa.FONTE_NAO_ENCONTRADA,
      success: false
    };
  }

  /**
   * Created by Lucas on 21/06/2017
   *
   * Função é usada para pegar a pesquisa do mês atual
   *
   * @param pesquisas
   */
  pegaPesquisaPeloMes(pesquisas) {
    let data = new Date();

    let mes_atual = data.getMonth() + 1;

    for (let pesquisa = 0; pesquisa < pesquisas.length; pesquisa++) {
      if (pesquisas[pesquisa].mes === mes_atual) {
        return pesquisas[pesquisa];
      }
    }
    return null;
  }

  /**
   * Created by Lucas on 20/06/2017
   *
   * Recebe o id de uma fonte e um array de fontes, retorna a fonte com o id
   * passado
   *
   * @param id_fonte
   * @param fontes
   */
  pegaFontePeloId(id_fonte, fontes) {
    for (let fonte = 0; fonte < fontes.length; fonte++) {
      if (id_fonte === fontes[fonte].fonte.id) {
        return fontes[fonte];
      }
    }
    let estrutura_botoes = messages.botoes.ANOTHER_ERRORS;
    let modal = this.adicionaEstruturaDoModal(messages.pesquisa.FONTE_NAO_ENCONTRADA,
      estrutura_botoes, 'Fonte Nao Encontrada');

    return {
      modal: modal,
      data: messages.pesquisa.FONTE_NAO_ENCONTRADA,
      success: false
    };
  }

  /**
   * Faz o update no usuario logado para deslogado.
   *
   * @param id_usuario
   * @returns {Promise}
   */
  async logout(id_usuario) {

    let dado_update_usuario = {
      logado: false,
    };

    let update = new Objeto_update(id_usuario, dado_update_usuario);

    let ret = await this.emitServer('db.usuario.update', update);

    return this.retornaPadraoSucessData(ret, 'usuario');

  }

  /**
   * Created by Lucas on 03/08/2017
   * Salva a semana inserida pelo usuário
   * @param id_usuario
   * @param produtos
   */
  async salvaSemanaPesquisador(id_usuario, produtos, id_fonte) {
    if (id_usuario.hasOwnProperty('tipo') && id_usuario.tipo === 'admin') {
      throw new Error('erro no salva semana pesquisador');
    } else {
      let data_pesquisa = new Date();
      let dia_ultima_sexta = FuncoesData.getUltimaSexta(data_pesquisa.getFullYear(),
        data_pesquisa.getMonth());
      if (data_pesquisa.getDate() > dia_ultima_sexta) FuncoesData.setProximoMes(data_pesquisa);
      let query = {
        usuario: id_usuario.id, mes: data_pesquisa.getMonth() + 1, ano: data_pesquisa.getFullYear()
      };
      await this.formataObjetoProdutoParaId(produtos);
      await this.atualizaMudouEspec(query, id_fonte, produtos);
      let dados = {produtos: produtos, id_fonte: id_fonte, query: query};
      await this.emitServer('salva_semana_pesquisador', dados);
      await this.atualizaRelatorio({
        produtos: produtos,
        id_fonte: id_fonte,
        query: {ano: query.ano, mes: query.mes}
      });
      return this.padronizaSuccessData();
    }
  }


  /**
   * Created by Lucas on 04/08/2017
   * Atualiza o atributo mudou_espec de acordo com a semana anterior de cada produto
   * Recebe query para buscar a pesquisa (usuario, mes e ano) e o id_fonte da fonte desejada
   * @param produtos
   * @returns {Promise.<void>}
   */
  async atualizaMudouEspec(query, id_fonte, produtos) {
    let pesquisa = await this.emitServer('db.pesquisa.read', new Objeto_read(query));
    pesquisa = pesquisa.data.success[0];
    for(let i = 0; i < pesquisa.fontes.length; i++){
      if(pesquisa.fontes[i].fonte.toString() === id_fonte){
        let produtos_semana_anterior = pesquisa.fontes[i]
          .semanas[pesquisa.fontes[i].semanas.length - 1].semana_anterior.produtos;
        for(let j = 0; j < produtos.length; j++){
          for(let k = 0; k < produtos_semana_anterior.length; k++){
            if(produtos[j].produto === produtos_semana_anterior[k].produto.toString()){
              if(RegraMudouEspec.verificaSeMudouEspec(produtos[j], produtos_semana_anterior[k])){
                produtos[j].mudou_espec = true;
              }
               else {
                produtos[j].mudou_espec = false;
              }
            }
          }
        }
      }
    }
  }

  insereInformacoesAnteriores(semana_retorno) {
    for(let i = 0; i < semana_retorno.semana.produtos.length; i++){
      for(let j = 0; j < semana_retorno.semana.semana_anterior.produtos.length; j++){
        if(semana_retorno.semana.produtos[i].produto.id === semana_retorno.semana.semana_anterior
            .produtos[j].produto.toString()){
          semana_retorno.semana.produtos[i].espec1_anterior = semana_retorno.semana.semana_anterior
            .produtos[j].espec1;
          semana_retorno.semana.produtos[i].espec2_anterior = semana_retorno.semana.semana_anterior
            .produtos[j].espec2;
          semana_retorno.semana.produtos[i].preco_anterior = semana_retorno.semana.semana_anterior
            .produtos[j].preco;
        }
      }
    }
  }

  /**
   * Le fontes do pesquisador, pelo usuario do mesmo
   * @param id_usuario
   * @returns {Promise.<*>}
   */
  async readFontesPesquisador(id_usuario) {

    let query = {_id: id_usuario};
    let select = 'fontes';
    let populate = {
      path: 'fontes.fonte',
      select: 'id nome tipo'
    };

    let obj_read = new Objeto_read(query, select, populate);

    let fontes = await this.emitServer('db.usuario.read', obj_read);

    return this.retornaPadraoSucessData(fontes, 'usuario');
  }

  /**
   * Created by Lucas on 03/08/2017
   * Recebe um array de objetos produto e retorna um array de objetos contendo apenas os ids.
   * A ideia da função é formatar para uma atualização no banco, já que o banco aceita apenas a
   * referencia
   * @param produtos
   * @returns {Promise.<void>}
   */
  async formataObjetoProdutoParaId(produtos) {
    for(let i = 0; i < produtos.length; i++){
      produtos[i].produto = produtos[i].produto.id;
    }
  }

  async atualizaRelatorio(dados) {
    dados.produtos = FuncoesMap.produtosToHash(dados.produtos);
    await this.emitServer('popula_relatorio', dados);
    //TODO PAREMO AQUI
    // await this.calculaVariacao();
    // await this.emitServer('calcula_relatorio', dados);
  }
}

module.exports = Pesquisador_handler;