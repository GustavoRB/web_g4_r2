/**
 * Singleton da rotina para criacao de semanas e meses
 *
 *
 * Created by Lucas on 11/07/2017.
 */
const FuncoesData = require('./util/FuncoesData');
const FuncoesMap = require('./util/FuncoesMap');
const Constantes = require('./util/constants.json').CONSTANTES_DATA;
const Messages = require('./util/messages.json').pesquisa;
const Messages_rela = require('./util/messages.json').relatorio_mes;
const Basico = require('./handlers/basic_handler');
const Objeto_read = require('./handlers/util_handler/objeto_pesquisa');

class RotinaCriacaoSemanasEMeses extends Basico {

  constructor() {
    super();

    if (!RotinaCriacaoSemanasEMeses.instancia) {

      RotinaCriacaoSemanasEMeses.instancia = this;
    }
    return RotinaCriacaoSemanasEMeses.instancia;
  }

  /**
   * Created by Lucas on 12/07/2017
   * Ao ser iniciada, descobre quanto tempo falta para sexta-feira, ao terminar
   * o timer para sexta, irá enviar uma solicitação ao banco para que sejam
   * criadas as semanas e os meses. Após isso, inicia um novo timer com o tempo
   * exato para chegar na próxima sexta.
   */
  start() {
    let horas_para_fim_do_dia = FuncoesData.getDiferencaHorarioAtualEFechamento();
    let dias_para_o_proximo_fechamento = FuncoesData
      .getQuantidadeDiasProximaSexta(new Date());
    let timer = (dias_para_o_proximo_fechamento *
      Constantes.MILLISECONDS_IN_A_DAY) + horas_para_fim_do_dia;
    //TODO: Trocar 1000 por timer quando parar de testar
    setTimeout(instancia.startRotinaConstante, 1000);
  }

  /**
   * Created by OLDS on 14/07/2017
   *
   * Começa a rotina com o timer constante
   *
   */
  startRotinaConstante() {
    //TODO: Trocar 2000 por millis_para_proxima_sexta quando parar de testar
    let millis_para_proxima_sexta = Constantes.MILLISECONDS_IN_A_DAY *
      Constantes.NUMERO_DIAS_DA_SEMANA;
    // setInterval(instancia.requisitaCriacaoMesSemanas, millis_para_proxima_sexta);
    setTimeout(instancia.requisitaCriacaoMesSemanas, 1000);

  }


  /**
   * Created by OLDS on 14/07/2017
   *
   * Dispara requisições para o banco com o mês e semana necessários para criação
   * de uma nova semana/mes. Verifica se o dia atual é a última sexta-feira do
   * mês ou posterior. Se sim, quer dizer que o sistema já está no mês seguinte e
   * deve ser requisitado para que se crie este mês.
   *
   */
  requisitaCriacaoMesSemanas() {
    let data_atual = new Date();
    let dia_primeira_sexta = FuncoesData.getDiaPrimeiraSexta(data_atual);
    let dia_ultima_sexta = FuncoesData.getUltimaSexta(data_atual.getFullYear(),
      data_atual.getMonth());
    let dia_proxima_sexta = FuncoesData.getDataProximaSexta(data_atual,
      dia_ultima_sexta).getDate();
    let data_modificavel = new Date(data_atual.getFullYear(), data_atual.getMonth() + 1, 0);
    FuncoesData.setProximoMes(data_modificavel);
    let retorno = {
      ano: data_modificavel.getFullYear(),
      mes: data_modificavel.getMonth(),
      semana: FuncoesData.getTotalDeSemanasExistentesMesAtual(dia_proxima_sexta,
        dia_primeira_sexta)
      //TINHA UM +1 NA SEMANA
    };
    if (data_atual.getDate() >= dia_ultima_sexta) {
      retorno.mes = data_modificavel.getMonth() + 1 === 12 ? 1 : data_modificavel.getMonth() + 1;
      retorno.ano = retorno.mes === 1 ? data_modificavel.getFullYear() + 1 :
        data_modificavel.getFullYear();
      retorno.semana = 1;
    }
    instancia.criaMesOuSemana(retorno);
  }

  /**
   * Created by OLDS on 18/07/2017
   *
   * Pesquisa todos os usuários ativos e todas as fontes. Se semana = 1, requi-
   * sita criação do próximo mês, se não, requisita criação da próxima semana.
   *
   * @param semana_e_mes
   */
  async criaMesOuSemana(semana_e_mes) {
    let obj_read_usuarios = new Objeto_read({'ativo': true});
    let usuarios_ativos = await instancia.emitServer('db.usuario.read', obj_read_usuarios);
    usuarios_ativos = usuarios_ativos.data.success;
    let fontes = await instancia.emitServer('db.fonte.read', new Objeto_read({'ativo': true}));
    fontes = fontes.data.success;
    instancia.criaOuAtualizaPesquisa(fontes, usuarios_ativos, semana_e_mes);
  }

  /**
   * Created by OLDS on 19/07/2017
   *
   * Fecha semanas anteriores e requisita criação de novas pesquisas para todos os
   * usuários.
   *
   * @param fontes
   * @param usuarios_ativos
   * @param semana_e_mes
   */
  async criaOuAtualizaPesquisa(fontes, usuarios_ativos, semana_e_mes) {
    let ids_usuarios = instancia.getIdsUsuarios(usuarios_ativos);
    semana_e_mes.semanas_anteriores = await instancia
      .getSemanasAnteriores(semana_e_mes, ids_usuarios);
    // semana_e_mes.semana = 1;
    // //TODO: RETIRAR
    if (semana_e_mes.semana === 1) {
      let relatorio = await instancia.criaRelatorio(fontes, semana_e_mes);
      await instancia.emitCriacaoRelatorio(relatorio);
      let novas_pesquisas = await instancia.criaPesquisas(ids_usuarios, semana_e_mes, fontes);
      instancia.emitCriacaoPesquisas(novas_pesquisas);
    } else {
      let novas_semanas_relatorio = await instancia.criaSemanaRelatorio(semana_e_mes);
      await instancia.emitAtualizacaoRelatorio(novas_semanas_relatorio, semana_e_mes);
      let novas_semanas = await instancia.criaSemanas(ids_usuarios, semana_e_mes);
      instancia.emitAtualizacaoPesquisas(novas_semanas, ids_usuarios, semana_e_mes);
    }
  }

  /**
   * Created by OLDS on 18/07/2017
   *
   * Pega as pesquisas com base nos usuários ativos, percorre as fontes de cada
   * pesquisa e retorna a última semana e o id da fonte. Se a semana = 1, a query
   * é feita com base no mês anterior.
   *
   * @param semana_e_mes
   * @param ids_usuarios_ativos
   */
  async getSemanasAnteriores(semana_e_mes, ids_usuarios_ativos) {
    let query = {'usuario': {$in: ids_usuarios_ativos}};
    query.mes = semana_e_mes.semana === 1 ? FuncoesData.getMesAnterior(semana_e_mes.mes)
      : semana_e_mes.mes;
    query.ano = query.mes === 12 ? semana_e_mes.ano - 1 : semana_e_mes.ano;
    let pesquisas = await instancia.emitServer('fecha_semanas_e_retorna_pesquisas', query);
    pesquisas = pesquisas.data.success;

    let semanas_fontes = [];

    for (let i = 0; i < pesquisas.length; i++) {
      for (let j = 0; j < pesquisas[i].fontes.length; j++) {
        let semana_fonte = new Object({
          usuario: pesquisas[i].usuario.toString(),
          id_fonte: pesquisas[i].fontes[j].fonte.toString(),
          semana: pesquisas[i].fontes[j].semanas[pesquisas[i]
            .fontes[j].semanas.length - 1]
        });
        delete semana_fonte.semana.semana_anterior;
        semanas_fontes.push(semana_fonte);
      }
    }
    return semanas_fontes;
  }

  /**
   * Created by OLDS on 19/07/2017
   *
   * Cria um objeto pesquisa para cada usuário ativo, e insere a primeira semana do mês, juntamente
   * com a última semana do mês anterior. Por fim retorna um array com todas as pesquisas a serem
   * criadas.
   *
   * @param ids_usuarios
   * @param semana_e_mes
   * @param fontes
   * @returns {Array}
   */
  async criaPesquisas(ids_usuarios, semana_e_mes, fontes) {
    let pesquisas = [];

    for (let n = 0; n < ids_usuarios.length; n++) {
      let pesquisa = instancia.getObjetoPesquisa(semana_e_mes);
      pesquisa.usuario = ids_usuarios[n];
      let fontes_usuario = instancia.getFontesUsuario(ids_usuarios[n], fontes);

      for (let i = 0; i < fontes_usuario.length; i++) {
        pesquisa.fontes.push(instancia.getObjetoFonte(semana_e_mes, fontes_usuario[i].id));
        pesquisa.fontes[i].semanas[0].semana_anterior = instancia
          .getSemanaAnteriorDaFonte(fontes_usuario[i].id, semana_e_mes.semanas_anteriores);
        let produtos = pesquisa.fontes[i].semanas[0].semana_anterior.produtos;
        let ids_produtos = instancia.getIdsProdutosFonte(fontes_usuario[i]);
        instancia.insereProdutosNaSemana(produtos, ids_produtos, pesquisa.fontes[i].semanas[0]);
        await instancia.emitServer('fecha_pesquisa_mes_anterior', {
          'usuario': pesquisa.usuario,
          'mes': FuncoesData.getMesAnterior(semana_e_mes.mes),
          'ano': FuncoesData.getMesAnterior(semana_e_mes.mes) === 12 ? semana_e_mes.ano - 1
            : semana_e_mes.ano
        });
      }
      pesquisas.push(pesquisa);
    }
    return pesquisas;
  }

  /**
   * Created by OLDS on 25/07/2017
   *
   * Recebe as novas pesquisas a serem criadas, verifica se já existe alguma igual para evitar
   * inconsistência no banco e, se não houver, soliita ao banco que crie.
   *
   * @param novas_pesquisas
   * @returns {Promise.<void>}
   */
  async emitCriacaoPesquisas(novas_pesquisas) {
    let usuarios = [];
    let query = {
      'mes': novas_pesquisas[0].mes, 'usuario': {$in: usuarios},
      'ano': novas_pesquisas[0].ano
    };
    for (let pesquisa in novas_pesquisas) {
      usuarios.push(novas_pesquisas[pesquisa].usuario);
    }
    let obj_read = new Objeto_read(query);
    let pesquisas = await instancia.emitServer('db.pesquisa.read', obj_read);
    if (pesquisas.data.success.length === 0) {
      //Se não tiver pesquisas, cria-se
      instancia.emitServer('db.pesquisa.create', novas_pesquisas);
    } else {
      throw new Error(Messages.PESQUISA_JA_CRIADA);
    }
  }

  /**
   * Created by OLDS on 19/07/2017
   *
   * Retorna um array de objetos fonte_semana para ser criado no banco.
   *
   * @param ids_usuarios
   * @param fontes
   * @param semana_e_mes
   */
  async criaSemanas(ids_usuarios, semana_e_mes) {
    let query = {'mes': semana_e_mes.mes, 'usuario': {$in: ids_usuarios}, 'ano': semana_e_mes.ano};
    let populate = ({path: 'fontes.fonte', select: 'id produtos'});
    let obj_read = new Objeto_read(query, null, populate);
    let pesquisas = await instancia.emitServer('db.pesquisa.read', obj_read);
    pesquisas = pesquisas.data.success;
    let semanas_anteriores = semana_e_mes.semanas_anteriores;

    let fontes_semanas = [];

    for (let i = 0; i < pesquisas.length; i++) {
      for (let j = 0; j < pesquisas[i].fontes.length; j++) {
        let fonte_usuario = {
          fonte: pesquisas[i].fontes[j].fonte,
          usuario: pesquisas[i].usuario.toString()
        };
        fontes_semanas.push(instancia.getFonteSemana(fonte_usuario, semanas_anteriores,
          semana_e_mes.semana));
      }
    }
    return fontes_semanas;
  }

  /**
   * Created by OLDS on 26/07/2017
   *
   * Recebe as novas semanas para serem criadas, verifica se já não existe nenhuma com o mesmo
   * número para evitar inconsistências no banco e, se não existir, solicita ao banco que crie as
   * semanas.
   *
   * @param novas_semanas
   * @param ids_usuarios_ativos
   * @param semana_e_mes
   * @returns {Promise.<void>}
   */
  async emitAtualizacaoPesquisas(novas_semanas, ids_usuarios_ativos, semana_e_mes) {
    let query = {
      'mes': semana_e_mes.mes, 'usuario': {$in: ids_usuarios_ativos},
      'ano': semana_e_mes.ano
    };
    let obj_read = new Objeto_read(query);
    let pesquisas = await instancia.emitServer('db.pesquisa.read', obj_read);
    pesquisas = pesquisas.data.success;
    for (let i = 0; i < pesquisas.length; i++) {
      for (let j = 0; j < pesquisas[i].fontes.length; j++) {
        for (let k = 0; k < novas_semanas.length; k++) {
          if (pesquisas[i].fontes[j].fonte.toString() === novas_semanas[k].fonte) {
            if (pesquisas[i].fontes[j].semanas[pesquisas[i].fontes[j].semanas.length - 1].numero ===
              novas_semanas[k].semana.numero) {
              throw new Error(Messages.SEMANA_JA_CRIADA);
            }
          }
        }
      }
    }
    await instancia.emitServer('atualiza_novas_semanas', {
      'novas_semanas': novas_semanas, 'mes': semana_e_mes.mes, 'ano': semana_e_mes.ano,
      'usuarios': ids_usuarios_ativos
    });
  }

  /**
   * Created by OLDS on 19/07/2017
   *
   * Retorna array com ids dos usuarios passados como parâmetro
   *
   * @param usuarios_ativos
   * @returns {Array}
   */
  getIdsUsuarios(usuarios_ativos) {
    let ids_usuarios = [];
    for (let i = 0; i < usuarios_ativos.length; i++) {
      ids_usuarios.push(usuarios_ativos[i].id);
    }
    return ids_usuarios;
  }

  /**
   * Created by OLDS on 19/07/2017
   *
   * Metodo para retornar o objeto padrão de uma nova pesquisa.
   *
   * @param semana_e_mes
   * @returns {{mes: (number|*|schema.mes|{type, required}|{data, dados}), usuario: string, fontes: [*]}}
   */
  getObjetoPesquisa(semana_e_mes) {
    return new Object({
      ano: semana_e_mes.ano,
      mes: semana_e_mes.mes,
      usuario: '',
      fontes: []
    });
  }

  /**
   * Created by OLDS on 25/07/2017
   *
   * Metodo para retornar o objeto padrão de um novo objeto fonte.
   *
   * @param semana_e_mes
   * @param id_fonte
   * @returns {Object}
   */
  getObjetoFonte(semana_e_mes, id_fonte) {
    return new Object({
      fonte: id_fonte,
      semanas: [{
        numero: semana_e_mes.semana,
        fechada: false,
        produtos: []
      }]
    })
  }

  /**
   * Created by OLDS on 26/07/2017
   *
   * Metodo para retornar o objeto padrão de uma nova semana.
   *
   * @param ids_produtos
   * @param numero
   * @param semana_anterior
   * @returns {Object}
   */
  getObjetoSemana(numero, semana_anterior) {
    return new Object({
      fechada: false,
      numero: numero,
      produtos: [],
      semana_anterior: semana_anterior
    });
  }

  /**
   * Created by OLDS on 19/07/2017
   *
   * Retorna ids dos produtos da fonte referência.
   *
   * @param fonte_usuario
   * @returns {Array}
   */
  getIdsProdutosFonte(fonte_usuario) {
    let ids_produtos = [];
    for (let i = 0; i < fonte_usuario.produtos.length; i++) {
      ids_produtos.push(fonte_usuario.produtos[i].produto.toString());
    }
    return ids_produtos;
  }

  /**
   * Created by OLDS on 19/07/2017
   *
   * Retorna semana anterior da fonte desejada.
   *
   * @param id_fonte_usuario
   * @param semanas_anteriores possui parâmetro id_fonte para identificar que esta semana pertence
   * à fonte referenciada.
   * @returns {number|*|string}
   */
  getSemanaAnteriorDaFonte(id_fonte_usuario, semanas_anteriores) {
    for (let semana in semanas_anteriores) {
      if (id_fonte_usuario === semanas_anteriores[semana].id_fonte) {
        return semanas_anteriores[semana].semana;
      }
    }
  }

  /**
   * Created by OLDS on 19/07/2017
   *
   * Pega os ids das fontes do usuário com base nos pesquisadores vinculados à fonte.
   *
   * @param id_usuario
   * @param fontes
   * @returns {Array}
   */
  getFontesUsuario(id_usuario, fontes) {
    let fontes_usuario = [];
    for (let i = 0; i < fontes.length; i++) {
      for (let j = 0; j < fontes[i].pesquisadores.length; j++) {
        if (fontes[i].pesquisadores[j].usuario.toString() === id_usuario) {
          fontes_usuario.push(fontes[i]);
        }
      }
    }
    return fontes_usuario;
  }

  /**
   * Created by OLDS on 26/07/2017
   *
   * Retorna um objeto padrão com a fonte e semana para ser criada.
   *
   * @param fonte_usuario
   * @param semanas_anteriores
   * @param semana
   * @returns {Object}
   */
  getFonteSemana(fonte_usuario, semanas_anteriores, semana) {
    for (let i = 0; i < semanas_anteriores.length; i++) {
      if (fonte_usuario.fonte.id === semanas_anteriores[i].id_fonte) {
        if (fonte_usuario.usuario === semanas_anteriores[i].usuario) {
          let ids_produtos = instancia.getIdsProdutosFonte(fonte_usuario.fonte);
          let produtos = semanas_anteriores[i].semana.produtos;
          let nova_semana = instancia.getObjetoSemana(semana,
            semanas_anteriores[i].semana);
          instancia.insereProdutosNaSemana(produtos, ids_produtos, nova_semana);
          return new Object({
            usuario: fonte_usuario.usuario,
            fonte: fonte_usuario.fonte.id,
            semana: nova_semana
          });
        }
      }
    }
  }

  insereProdutosNaSemana(produtos, ids_produtos, semana) {

    for (let i = 0; i < produtos.length; i++) {
      for (let j = 0; j < ids_produtos.length; j++) {
        if (produtos[i].produto.toString() === ids_produtos[j]) {
          semana.produtos.push(new Object({
            produto: ids_produtos[j],
            espec1: produtos[i].espec1,
            espec2: produtos[i].espec2,
            preco: 0
          }));
        }
      }
    }
  }

  async criaRelatorio(fontes, semana_e_mes) {
    let fontes_modificaveis = new Object(fontes);
    for (let i = 0; i < fontes_modificaveis.length; i++) {
      fontes_modificaveis[i].produtos = FuncoesMap.produtosDBToHash(fontes_modificaveis[i].produtos);
    }
    let produtos = await this.emitServer('db.produto.read', new Objeto_read({'ativo': true}));
    produtos = produtos.data.success;
    return await instancia.getObjetoRelatorio(fontes_modificaveis, semana_e_mes, produtos);
  }

  async getObjetoRelatorio(fontes, semana_e_mes, produtos) {
    return new Object({
      ano: semana_e_mes.ano,
      mes: semana_e_mes.mes,
      produtos: await instancia.getObjetoProdutosRelatorio(produtos, fontes, semana_e_mes)
    });
  }

  async getObjetoProdutosRelatorio(produtos, fontes, semana_e_mes) {
    let retorno = [];
    for (let i = 0; i < produtos.length; i++) {
      retorno.push(new Object({
        produto: produtos[i].id,
        fontes: await instancia.getObjetoFontesRelatorio(produtos[i].id, fontes, semana_e_mes)
      }));
    }
    return retorno;
  }

  async getObjetoFontesRelatorio(id_produto, fontes, semana_e_mes) {
    let fontes_ret = [];
    for (let i = 0; i < fontes.length; i++) {
      if (fontes[i].produtos.has(id_produto)) {
        fontes_ret.push(new Object({
          fonte: fontes[i].id,
          semanas: [{
            semana_anterior: await instancia.getUltimaSemanaRelatorioAnterior(
              id_produto, fontes[i].id, semana_e_mes),
            semana_atual: {
              numero: 1
            }
          }]
        }));
      }
    }
    return fontes_ret;
  }

  async getUltimaSemanaRelatorioAnterior(id_produto, fonte_id, semana_e_mes) {
    let query = semana_e_mes.mes - 1 === 0 ? {ano: semana_e_mes.ano - 1, mes: 12} :
      {ano: semana_e_mes.ano, mes: semana_e_mes.mes - 1};
    let relatorio_anterior = await this.emitServer('db.relatorio_mes.read', new Objeto_read(query));
    relatorio_anterior = relatorio_anterior.data.success[0];
    relatorio_anterior.produtos = FuncoesMap.produtosDBToHash(relatorio_anterior.produtos);
    let ret = new Object({
      numero: 0,
      preco: 0
    });
    if (relatorio_anterior.produtos.has(id_produto)) {
      relatorio_anterior.produtos.get(id_produto).fontes = FuncoesMap.fontesDBToHash(
        relatorio_anterior.produtos.get(id_produto).fontes);
      if (relatorio_anterior.produtos.get(id_produto).fontes.has(fonte_id)) {
        ret.numero = relatorio_anterior.produtos.get(id_produto).fontes.get(fonte_id)
          .semanas[relatorio_anterior.produtos.get(id_produto).fontes
          .get(fonte_id).semanas.length - 1].semana_atual.numero;
        ret.preco = relatorio_anterior.produtos.get(id_produto).fontes.get(fonte_id)
          .semanas[relatorio_anterior.produtos.get(id_produto).fontes
          .get(fonte_id).semanas.length - 1].semana_atual.preco;
      }
    }
    return ret;
  }

  async emitCriacaoRelatorio(relatorio) {
    let query = {
      'mes': relatorio.mes,
      'ano': relatorio.ano
    };
    let obj_read = new Objeto_read(query);
    let relatorio_ret = await instancia.emitServer('db.relatorio_mes.read', obj_read);
    if (relatorio_ret.data.success.length === 0) {
      //Se não houver relatório, cria-se
      instancia.emitServer('db.relatorio_mes.create', relatorio);
    } else {
      throw new Error(Messages_rela.RELATORIO_JA_EXISTE);
    }
  }

  async criaSemanaRelatorio(semana_e_mes) {
    let query = {'ano': semana_e_mes.ano, 'mes': semana_e_mes.mes};
    let obj_read = new Objeto_read(query);
    let relatorio_atual = await this.emitServer('db.relatorio_mes.read', obj_read);
    relatorio_atual = relatorio_atual.data.success[0];
    let novas_semanas = [];
    for (let i = 0; i < relatorio_atual.produtos.length; i++) {
      novas_semanas.push(new Object({
        produto: relatorio_atual.produtos[i].produto.toString(),
        fontes: instancia.getObjetoFontesSemanaRelatorio(
          relatorio_atual.produtos[i].fontes,
          semana_e_mes)
      }));
    }
    return novas_semanas;
  }

  getObjetoFontesSemanaRelatorio(fontes, semana_e_mes) {
    let fontes_semanas = [];
    for (let i = 0; i < fontes.length; i++) {
      fontes_semanas.push(new Object({
        fonte: fontes[i].fonte.toString(),
        semana: {
          semana_anterior: {
            numero: fontes[i].semanas[fontes[i].semanas.length - 1].semana_atual.numero,
            preco: fontes[i].semanas[fontes[i].semanas.length - 1].semana_atual.preco || 0
          },
          semana_atual: {
            numero: semana_e_mes.semana,
            preco: 0
          }
        }
      }));
    }
    return fontes_semanas;
  }

  async emitAtualizacaoRelatorio(novas_semanas_relatorio, semana_e_mes) {
    let query = {'ano': semana_e_mes.ano, 'mes': semana_e_mes.mes};
    let obj_read = new Objeto_read(query);
    let relatorio_atual = await this.emitServer('db.relatorio_mes.read', obj_read);
    if(relatorio_atual.data.success[0].produtos[0].fontes[0].semanas.length === semana_e_mes.semana){
      // throw new Error(Messages_rela.SEMANA_JA_EXISTE)
    } else {
      novas_semanas_relatorio = FuncoesMap.novasSemanasRelatorioToHash(novas_semanas_relatorio);
      await this.emitServer('atualiza_novas_semanas_relatorio', {semanas: novas_semanas_relatorio,
        semana: semana_e_mes.semana, mes: semana_e_mes.mes, ano: semana_e_mes.ano});
    }
  }
}

const instancia = new RotinaCriacaoSemanasEMeses();
Object.freeze(instancia);

module.exports = instancia;