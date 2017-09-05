const Pesquisador_handler = require('./pesquisador_handler');
const Objeto_pesquisa = require('./util_handler/objeto_pesquisa');
const Objeto_update = require('./util_handler/objeto_update');
const RegraMudouEspec = require('../util/RegraMudouEspec');
const FuncoesMap = require('../util/FuncoesMap');
const xlsx2json = require('xlsx2json');
const path = require('path');
const util = require('../util/util');

class Admin_handler extends Pesquisador_handler {

  /**
   * Created by Thiago on 23/08/2017
   *
   * Encaminha solicitação de leitura das cidades para o Cidade manager.
   *
   * @returns {Promise.<*>}
   */
  async readCidades() {
    let cidades_ordenadas = await this.emitServer('read_cidades', {});
    return this.retornaPadraoSucessData(cidades_ordenadas, 'cidade');
  }

  /**
   * Created by Thiago on 23/08/2017
   *
   * Encaminha solicitação de leitura das regiões para o Regiao manager.
   *
   * @returns {Promise.<*>}
   */
  async readRegioes() {
    let regioes_ordenadas = await this.emitServer('read_regioes', {});
    return this.retornaPadraoSucessData(regioes_ordenadas, 'regiao');
  }

  async readPesquisadoresFonte(id_fonte) {
    let query = {'_id': id_fonte};
    let select = 'pesquisadores.usuario';
    let populate = ({path: 'pesquisadores.usuario', select: 'nome'});
    let obj_pesquisa = new Objeto_pesquisa(query, select, populate);
    let ret = await this.emitServer('db.fonte.read', obj_pesquisa);
    return this.retornaPadraoSucessData(ret, 'fonte');
  }

  async updatePesquisador(atributos_update) {
    let update = {
      nome: atributos_update.nome,
      login: atributos_update.login,
      numerocelular: atributos_update.numerocelular,
      regiao: atributos_update.regiao,
      datanascimento: atributos_update.datanascimento
    };
    let obj_update = new Objeto_update(atributos_update.id, update);
    let usuario_updated = await this.emitServer('db.usuario.update', obj_update);
    return this.padronizaSuccessData(usuario_updated.data.success);
  }

  /**
   *
   * @param msg
   * @returns {Promise.<void>}
   */
  async readUsuariosAtivosAlfaOrdem(msg){
    let obj_pesquisa = new Objeto_pesquisa({ativo: true});
    let usuarios_ordenados = await this.emitServer('db.usuario.read', obj_pesquisa);
    return await this.padronizaSuccessData(usuarios_ordenados.data.success);
  }

  /**
   * Lê fontes ativas (utilizado para o filtro do admin)
   * @returns {Promise.<*>}
   */
  async readFontes(){
    let obj_pesquisa = new Objeto_pesquisa({ativo: true});
    let fontes_ativas = await this.emitServer('db.fonte.read', obj_pesquisa);
    return this.retornaPadraoSucessData(fontes_ativas, 'fonte');

    // let obj_pesquisa = new Objeto_pesquisa({ativo: true});
    // let fontes_ordenadas = await this.emitServer('read_fontes', obj_pesquisa);
    // return this.retornaPadraoSucessData(fontes_ordenadas, 'fonte');

  }

  /**
   * Created by Thiago on 25/08/2017
   *
   * Lê fontes ativas e popula o usuário e os produtos.
   *
   * @returns {Promise.<void>}
   */
  async readFontesPopulate() {
    let query = {ativo: true};
    let populate = {
      path: 'pesquisadores.usuario produtos.produto',
      select: 'id nome numerocelular datanascimento codigo'
    };
    let obj_pesquisa = new Objeto_pesquisa(query, null, populate);
    let fontes_ativas_populadas = await this.emitServer('db.fonte.read', obj_pesquisa);
    return this.retornaPadraoSucessData(fontes_ativas_populadas, 'fonte');
  }

  /**
   * Created by Lucas on 26/05/2017
   *
   * Edita fonte existente
   *
   * @param id_fonte
   * @param update
   * @returns {Promise.<void>}
   */
  async editaFonte(id_fonte, update) {

    let fonte_retorno;

    let obj_update = new Objeto_update(id_fonte, update);

    let ret = await this.emitServer('db.fonte.update', obj_update);

    fonte_retorno = this.retornaPadraoSucessData(ret, 'fonte');

    return fonte_retorno;

  }

  /**
   * Created by OLDS on 14/08/2017
   *
   * @param pesquisa
   * @returns {Promise.<void>}
   */
  async salvarPesquisa(dados) {

    this.removeAtributosProduto(dados.produtos);
    let pesquisa_alterada = await this.atualizaSemana(dados);
    await this.atualizaSemanaSeguinte(pesquisa_alterada, dados);
    return this.padronizaSuccessData();
  }

  async atualizaSemana(dados) {
    let obj_read = new Objeto_pesquisa({'_id': dados.pesquisa});
    let pesquisa = await this.emitServer('db.pesquisa.read', obj_read);
    pesquisa = pesquisa.data.success[0];
    let fontes_map = FuncoesMap.fontesDBToHash(pesquisa.fontes);
    if(fontes_map.has(dados.fonte)){
      let produtos_fonte = fontes_map.get(dados.fonte).semanas[dados.semana - 1].produtos;
      let map_produtos_alterados = FuncoesMap.produtosToHash(dados.produtos);
      let map_produtos_semana_anterior = FuncoesMap.produtosDBToHash(fontes_map.get(dados.fonte)
        .semanas[dados.semana - 1].semana_anterior.produtos);
      for(let i = 0; i < produtos_fonte.length; i++){
        let id_produto_ref = produtos_fonte[i].produto.toString();
        if(map_produtos_alterados.has(id_produto_ref) &&
          map_produtos_semana_anterior.has(id_produto_ref)){
          produtos_fonte[i].mudou_espec = RegraMudouEspec.verificaSeMudouEspec(
            map_produtos_alterados.get(id_produto_ref),
            map_produtos_semana_anterior.get(id_produto_ref)
          );
          produtos_fonte[i].espec1 = map_produtos_alterados.get(id_produto_ref).espec1;
          produtos_fonte[i].espec2 = map_produtos_alterados.get(id_produto_ref).espec2;
          produtos_fonte[i].preco = map_produtos_alterados.get(id_produto_ref).preco;
          produtos_fonte[i].promocao = map_produtos_alterados.get(id_produto_ref).promocao;
        }
      }
      dados.produtos = produtos_fonte;
      return await this.emitServer('salva_semana_admin', {
        pesquisa: pesquisa,
        fonte: dados.fonte,
        semana: dados.semana,
        produtos: produtos_fonte
      });
    }
  }

  async atualizaSemanaSeguinte(pesquisa_alterada, dados) {
    pesquisa_alterada = pesquisa_alterada.data.success[0];
    for (let i = 0; i < pesquisa_alterada.fontes.length; i++) {
      if (pesquisa_alterada.fontes[i].fonte.toString() === dados.fonte) {
        let semana = pesquisa_alterada.fontes[i].semanas[dados.semana];
        if (semana === undefined) {
          //Não tem semana seguinte do mês alterado
          let mes = pesquisa_alterada.mes === 12 ? 0 : pesquisa_alterada.mes + 1;
          let ano = pesquisa_alterada.mes === 12 ? pesquisa_alterada.ano + 1 : pesquisa_alterada.ano;
          let obj_read = new Objeto_pesquisa({
            ano: ano,
            mes: mes,
            usuario: pesquisa_alterada.usuario
          });
          let pesquisa_mes_seguinte = await this.emitServer('db.pesquisa.read', obj_read);
          pesquisa_mes_seguinte = pesquisa_mes_seguinte.data.success[0];

          if (pesquisa_mes_seguinte) {
            //Tem pesquisa do mês seguinte
            this.emitSalvarPesquisaAtualizaSemanaAnterior(pesquisa_mes_seguinte, dados, 1);
          }
        } else {
          //Tem semana seguinte do mês alterado
          this.emitSalvarPesquisaAtualizaSemanaAnterior(pesquisa_alterada, dados, semana.numero);
        }
      }
    }
  }

  async emitSalvarPesquisaAtualizaSemanaAnterior(pesquisa, dados, numero_semana) {
    let fontes_map = FuncoesMap.fontesDBToHash(pesquisa.fontes);
    let produtos = RegraMudouEspec.verificaSeMudouEspecProdutos(fontes_map.get(dados.fonte)
      .semanas[numero_semana - 1].produtos, FuncoesMap.produtosDBToHash(dados.produtos));
    if(fontes_map.has(dados.fonte)){
      let query = {
        pesquisa: pesquisa.id,
        fonte: fontes_map.get(dados.fonte).fonte.toString(),
        semana: numero_semana
      };
      await this.emitServer('salvar_pesquisa_atualiza_semana_anterior', {
        query: query,
        produtos_semana_anterior: dados.produtos,
        produtos: produtos
      });
    }
  }

  /**
   * Created by Thiago on 28/08/2017
   *
   * Cadastra nova fonte.
   *
   * @param regiao
   * @returns {Promise.<void>}
   */
  async cadastraRegiao(regiao){
    let ret = await this.emitServer('db.regiao.create', regiao);
    return this.retornaPadraoSucessData(ret, 'regiao');
  }

  /**
   * Created by Lucas on 26/05/2017
   *
   * Cadastra nova fonte
   *
   * @param nova_fonte
   * @returns {Promise.<void>}
   */
  async cadastraFonte(nova_fonte) {

    let fonte_retorno;

    let ret = await this.emitServer('db.fonte.create', nova_fonte);

    fonte_retorno = this.retornaPadraoSucessData(ret, 'Fonte');

    return fonte_retorno;

  }

  /**
   * Created by Lucas on 17/05/2017
   *
   * Cadastra novo usuário
   *
   * @param usuario
   * @returns {Promise.<void>}
   */
  async cadastraUsuario(usuario_novo) {

    let usuario_retorno;

    let ret = await this.emitServer('db.usuario.create', usuario_novo);

    usuario_retorno = this.retornaPadraoSucessData(ret, 'usuario');

    return usuario_retorno;
  }

  /**
   * Created by Lucas on 24/05/2017
   *
   * Atualiza usuario ativo(true) para ativo(false)
   *
   * @param id_usuario
   * @returns {Promise.<void>}
   */
  async removeUsuario(id_usuario, update) {

    let usuario_retorno;

    let obj_update = new Objeto_update(id_usuario, update);

    let ret = await this.emitServer('db.usuario.update', obj_update);

    usuario_retorno = this.retornaPadraoSucessData(ret, 'usuario');

    return usuario_retorno;

  }

  /**
   * Created by Lucas on 25/05/2017
   *
   * Atualiza usuário de acordo com o update
   *
   * @param id_usuario
   * @param update
   * @returns {Promise.<void>}
   */
  async updateUsuario(id_usuario, update) {

    let obj_update = new Objeto_update(id_usuario, update);

    let usuario = await this.emitServer('db.admin.update', obj_update);

    return this.retornaPadraoSucessData(usuario, 'usuario');


  }

  /**
   * Created by Lucas on 23/05/2017
   *
   * lê usuarios de acordo com a condição
   *
   * @param is_ativo
   * @returns {Promise.<void>}
   */
  async readUsuariosByCondicao(condicao) {

    let obj_read = new Objeto_pesquisa(condicao, null, 'regiao');

    let read = await this.emitServer('db.admin.read', obj_read);

    return this.retornaPadraoSucessData(read, 'usuario');
  }

  /**
   * Funcao que recebe o xls do cliente e converte para json. Dependendo do tipo
   * de documento formata para o padrao do banco e salva.
   *
   * @param doc => Objeto com os dados do documento.
   * @returns {Promise.<void>}
   */
  async read_xls_from_client(doc) {

    let caminho = path.resolve('C:/projetos/Custo_de_vida_2.0.1//uploaded/'
      + doc.file_name);

    let dir_saved = await util.write_buffer(caminho, doc.file_buffer);

    let json_array = await xlsx2json(dir_saved);

    console.log('transformou');
  }

  /**
   * Remove atributos desnecessários
   * @param produtos
   */
  removeAtributosProduto(produtos) {
    for (let i = 0; i < produtos.length; i++) {
      delete produtos[i].espec1_anterior;
      delete produtos[i].espec2_anterior;
      delete produtos[i].preco_anterior;
      produtos[i].produto = produtos[i].produto.id;
    }
  }
}

module
  .exports = Admin_handler;