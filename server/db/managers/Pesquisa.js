/**
 * Created by Lucas on 15/05/2017.
 */
let Manager = require('./Manager');
let _model = require('../model/Pesquisa');
let FuncoesMap = require('../../util/FuncoesMap');

class Pesquisa extends Manager {


  wireCustomListeners() {
    this.hub.on("inserir_nova_pesquisa", this.inserir.bind(this));
    this.hub.on("salvar_pesquisa_incompleta", this.salvar.bind(this));
    this.hub.on("fecha_pesquisa_mes_anterior", this.handleFechaPesquisaMesAnterior.bind(this));
    this.hub.on("atualiza_novas_semanas", this.handleAtualizaNovasSemanas.bind(this));
    this.hub.on("fecha_semanas_e_retorna_pesquisas", this.handleFechaSemanasERetornaPesquisas.bind(this));
    this.hub.on("salva_semana_pesquisador", this.handleSalvaSemanaPesquisador.bind(this));
    this.hub.on("salva_semana_admin", this.handleSalvaSemanaAdmin.bind(this));
    this.hub.on("salvar_pesquisa_atualiza_semana_anterior", this.handleSalvaSemanaAtualizaSemanaAnterior.bind(this));
  }


  async handleSalvaSemanaAtualizaSemanaAnterior(msg) {
    if (msg.source_id === this.id) return;

    this.salvaSemanaAtualizaSemanaAnterior(msg.data.success)
      .then((ret) => {
        for (let i = 0; i < ret.length; i++) {
          ret[i] = ret[i].toJSON();
          ret[i].usuario = ret[i].usuario.toString();
        }
        this.answerPesquisa(msg.id, msg.event, ret, null);
      }).catch((error) => {
      this.answerPesquisa(msg.id, msg.event, null, error);
    });
  }

  async salvaSemanaAtualizaSemanaAnterior(msg) {
    let query = msg.query;
    let produtos_semana_anterior = msg.produtos_semana_anterior;
    let produtos = msg.produtos;
    let ret = await this.model.findById(query.pesquisa)
      .exec((err, pesquisa) => {
        if (err) {
          throw new Error("Erro no salvaSemanaAtualizaSemanaAnterior");
        } else {
          let fontes_map = FuncoesMap.fontesDBToHash(pesquisa.fontes);
          if(fontes_map.has(query.fonte)){
            fontes_map.get(query.fonte).semanas[query.semana - 1].produtos = produtos;
            fontes_map.get(query.fonte).semanas[query.semana - 1]
              .semana_anterior.produtos = produtos_semana_anterior;
            pesquisa.save((err) => {
              if (err) {
                throw new Error('Erro no salva semana pesquisador', err);
              }
            });
          }
        }
      });
    return [ret];
  }


  async handleSalvaSemanaAdmin(msg) {
    if (msg.source_id === this.id) return;

    this.salvaSemanaAdmin(msg.data.success)
      .then((ret) => {
        for (let i = 0; i < ret.length; i++) {
          ret[i] = ret[i].toJSON();
          ret[i].usuario = ret[i].usuario.toString();
        }
        this.answerPesquisa(msg.id, msg.event, ret, null);
      }).catch((error) => {
      this.answerPesquisa(msg.id, msg.event, null, error);
    });
  }

  async salvaSemanaAdmin(msg) {
    let ret = await this.model.findById({'_id': msg.pesquisa.id})
      .select('ano fechada fontes id mes usuario')
      .exec((err, pesquisa) => {
        if (err) {
          throw new Error('Erro no salvaSemanaAdmin ', err);
        } else {
          for (let i = 0; i < pesquisa.fontes.length; i++) {
            if (pesquisa.fontes[i].fonte.toString() === msg.fonte) {
              try {
                for (let j = 0; j < pesquisa.fontes[i].semanas[msg.semana - 1].produtos.length; j++) {
                  for (let k = 0; k < msg.produtos.length; k++) {
                    if (pesquisa.fontes[i].semanas[msg.semana - 1].produtos[j].produto.toString() ===
                      msg.produtos[k].produto.toString()) {
                      pesquisa.fontes[i].semanas[msg.semana - 1].produtos[j] = msg.produtos[k];
                    }
                  }
                }
              } catch (Exception) {
                throw new Error('Erro no salvaSemanaAdmin ', err);
              }
            }
          }
          pesquisa.save((err) => {
            if (err) {
              throw new Error('Erro no salva semana pesquisador', err);
            }
          });
        }
      });
    return [ret];
  }

  /**
   * Created by Lucas on 03/08/2017
   * @param msg
   * @returns {Promise.<void>}
   */
  async handleSalvaSemanaPesquisador(msg) {
    if (msg.source_id === this.id) return;

    this.salvaSemanaPesquisador(msg.data.success)
      .then((ret) => {
        this.answerPesquisa(msg.id, msg.event, ret, null);
      }).catch((error) => {
      this.answerPesquisa(msg.id, msg.event, null, error);
    });
  }

  /**
   * Created by Lucas on 03/08/2017
   * @param msg
   */
  async salvaSemanaPesquisador(msg) {
    let pesquisa = await this.model.findOne(msg.query)
      .exec((err, res) => {
          if (err) {
            throw new Error("erro no salva semana pesquisador", err);
          } else {
            for (let i = 0; i < res.fontes.length; i++) {
              if (res.fontes[i].fonte.toString() === msg.id_fonte) {
                if (msg.produtos.length !== res.fontes[i].semanas[res.fontes[i].semanas.length - 1]
                    .produtos.length) {
                  throw new Error("Erro no salva semana pesquisador, length produtos diferentes");
                } else {

                  res.fontes[i].semanas[res.fontes[i].semanas.length - 1].produtos = msg.produtos;
                }
              }
            }
          }
        }
      );
    pesquisa.save((err) => {
      if (err) {
        console.log('Erro no salva semana pesquisador', err);
      } else {
        return msg;
      }
    });
  }

  /**
   * Created by OLDS on 21/07/2017
   *
   * Atualiza fechada para true na pesquisa e na última semana do mês
   *
   * @returns {Promise.<void>}
   */
  async fechaPesquisaMesAnterior(msg) {
    let id_usuario = msg.usuario;
    let mes = msg.mes;
    let ano = msg.ano;

    let query = {'usuario': id_usuario, 'mes': mes, 'ano': ano};
    let pesquisa = await this.model.findOne(query)
      .exec((err, res) => {
        if (err) {
          console.log('Erro no find model do fechaPesquisaMesAnterior', err);
        } else if (!res.fechada) {
          //Se não fechada, fecha.
          res.fechada = true;
        }
      });
    pesquisa.save((err) => {
      if (err) {
        console.log('Erro no save model do fechaPesquisaMesAnterior', err);
      }
    });
    return msg;
  }

  handleFechaPesquisaMesAnterior(msg) {
    if (msg.source_id === this.id) return;

    this.fechaPesquisaMesAnterior(msg.data.success)
      .then((ret) => {
        this.answerPesquisa(msg.id, msg.event, ret, null);
      }).catch((error) => {
      this.answerPesquisa(msg.id, msg.event, null, error);
    });
  }

  handleFechaSemanasERetornaPesquisas(msg) {
    if (msg.source_id === this.id) return;

    this.fechaSemanasERetornaPesquisas(msg.data.success)
      .then((ret) => {
        this.answerPesquisa(msg.id, msg.event, ret, null);
      }).catch((error) => {
      this.answerPesquisa(msg.id, msg.event, null, error);
    });
  }

  answerPesquisa(id_mensagem, evento, success, error) {
    let dados = {
      success: success,
      error: error
    };

    this.hub.send(this, evento, dados, id_mensagem);
  }

  /**
   * Created by OLDS on 27/07/2017
   * @param msg
   * @returns {Promise.<void>}
   */
  async fechaSemanasERetornaPesquisas(query) {
    // let populate = 'fontes.semanas.produtos.produto'
    let pesquisas = await this.model.find(query).exec();
    for (let i = 0; i < pesquisas.length; i++) {
      for (let j = 0; j < pesquisas[i].fontes.length; j++) {
        pesquisas[i].fontes[j].semanas[pesquisas[i].fontes[j].semanas.length - 1].fechada = true;
        pesquisas[i].save((err) => {
          if (err) {
            console.log("Erro no save model do atualiza_novas_semanas", err);
          }
        });
      }
    }
    return this.afterRead(pesquisas);
  }

  handleAtualizaNovasSemanas(msg) {
    if (msg.source_id === this.id) return;

    this.atualizaNovasSemanas(msg.data.success)
      .then((ret) => {
        this.answerPesquisa(msg.id, msg.event, ret, null);
      }).catch((error) => {
      this.answerPesquisa(msg.id, msg.event, null, error);
    });
  }

  /**
   * Created by OLDS on 26/07/2017
   *
   * Recebe as novas semanas a serem inseridas nas pesquisas e requisita atualização para o banco.
   *
   * @param msg
   * @returns {Promise.<void>}
   */
  async atualizaNovasSemanas(msg) {
    let novas_semanas = msg.novas_semanas;
    let mes = msg.mes;
    let ano = msg.ano;
    let usuarios = msg.usuarios;
    let query = {'mes': mes, 'ano': ano, 'usuario': {$in: usuarios}};
    let pesquisas = await this.model.find(query).exec();
    for (let i = 0; i < pesquisas.length; i++) {
      for (let j = 0; j < pesquisas[i].fontes.length; j++) {
        for (let k = 0; k < novas_semanas.length; k++) {
          if (novas_semanas[k].fonte === pesquisas[i].fontes[j].fonte.toString()
            && novas_semanas[k].usuario === pesquisas[i].usuario.toString()) {
            pesquisas[i].fontes[j].semanas.push(novas_semanas[k].semana);
          }
        }
      }
      pesquisas[i].save((err) => {
        if (err) {
          console.log("Erro no save model do atualiza_novas_semanas", err);
        }
      });
    }
    return msg;
  }

  async salvar(msg) {
    console.log("msg", msg);
    let id_fonte = msg.data.success.fonte;
    let id_usuario = msg.data.success.usuario;
    let id_pesquisa = msg.data.success._id;
    let semana = msg.data.success.semana;
    let isToSave = msg.data.success.save;

    let pesquisa_atual = await this.model.findById(id_pesquisa)
    // .populate('fontes.fonte fontes.semanas fontes.semanas.produtos.produto')
      .exec();

    // for(let index = 0; index < pesquisa_atual.fontes.length; index++){
    //   if(pesquisa_atual.fontes[index]){
    //
    //   }
    //   let fonte_a_salvar = pesquisa_atual.fonte;
    // }

    console.log("ver", pesquisa_atual);


  }

  /**
   * Created by Lucas on 02/06/2017
   *
   * @param msg
   * @returns {Promise.<void>}
   */
  async inserir(msg) {
    let pesquisa_a_inserir = msg.data.success;
    let pesquisa_atual = await this.model.findById(pesquisa_a_inserir._id)
      .exec();

    let fontes_pesquisa_atual = pesquisa_atual.fontes;
    let id_fonte_a_inserir = pesquisa_a_inserir.fonte;
    for (let index = 0; index < fontes_pesquisa_atual.length; index++) {
      if (fontes_pesquisa_atual[index].fonte.toString() == id_fonte_a_inserir) {
        let produtos_a_atualizar = fontes_pesquisa_atual[index].produtos;
        let produtos_atualizados = pesquisa_a_inserir.produtos;
        await this.atualizaProdutos(produtos_a_atualizar,
          produtos_atualizados);
        break;
      }
    }
    return pesquisa_atual.toJSON();
  }

  /**
   * Created by Lucas on 08/06/2017
   * @param produtos_a_atualizar
   * @param produtos_atualizados
   * @returns {Promise.<*>}
   */
  async atualizaProdutos(produtos_a_atualizar, produtos_atualizados) {
    for (let index = 0; index < produtos_a_atualizar.length; index++) {
      for (let produto in produtos_atualizados) {
        if (produtos_a_atualizar[index].produto.toString()
          === produtos_atualizados[produto].produto) {
          let semana_produto_atualizado = produtos_atualizados[produto].semana;
          let quantidade_semanas_pesquisa = produtos_a_atualizar[index].semanas
            .length;
          if (quantidade_semanas_pesquisa === 4) {
            //TODO emitir erro, já tem 4 semanas
          }
          else {
            produtos_a_atualizar[index].semanas.push(semana_produto_atualizado);
            //atualizados os produtos a atualizar
            return produtos_a_atualizar;
          }
        }
      }
    }

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
    return 'pesquisa';
  }
}

module.exports = Pesquisa;