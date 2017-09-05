/**
 * Created by Lucas on 15/05/2017.
 */
let Manager = require('./Manager');
let Mensagem = require('../../util/messages.json').relatorio_mes;
let _model = require('../model/Relatorio_Mes');

class Relatorio_Mes extends Manager {

  wireCustomListeners() {
    this.hub.on("atualiza_novas_semanas_relatorio", this.handleAtualizaNovaSemana.bind(this));
    this.hub.on("popula_relatorio", this.handlePopulaRelatorio.bind(this));
  }

  async handlePopulaRelatorio(msg) {
    if (msg.source_id === this.id) return;

    this.populaRelatorio(msg.data.success)
      .then((ret) => {
        for (let i = 0; i < ret.length; i++) {
          ret[i] = ret[i].toJSON();
          ret[i].usuario = ret[i].usuario.toString();
        }
        this.customAnswer(msg.id, msg.event, ret, null);
      }).catch((error) => {
      this.customAnswer(msg.id, msg.event, null, error);
    });
  }

  async populaRelatorio(msg) {
    let relatorio = await this.model.findOne(msg.query)
      .exec((err, res) => {
        if(err){
          throw new Error('Erro no find model do populaRelatorio');
        } else {
          let produtos = msg.produtos;
          for(let i = 0; i < res.produtos.length; i++){
            if(produtos.has(res.produtos[i].produto.toString())){
              for(let j = 0; j < res.produtos[i].fontes.length; j++){
                if(res.produtos[i].fontes[j].fonte.toString() === msg.id_fonte){
                  res.produtos[i].fontes[j].semanas[res.produtos[i].fontes[j].semanas.length - 1]
                    .semana_atual.preco = produtos.get(res.produtos[i].produto.toString()).preco;
                  res.produtos[i].fontes[j].semanas[res.produtos[i].fontes[j].semanas.length - 1]
                    .semana_atual.mudou_espec = produtos.get(res.produtos[i].produto.toString())
                    .mudou_espec;
                }
              }
            }
          }
        }
      });
    relatorio.save((err) => {
      if (err) {
        console.log('Erro no populaRelatorio', err);
      } else {
        return msg;
      }
    });

  }

  async handleAtualizaNovaSemana(msg) {
    if (msg.source_id === this.id) return;

    this.atualizaNovaSemana(msg.data.success)
      .then((ret) => {
        for (let i = 0; i < ret.length; i++) {
          ret[i] = ret[i].toJSON();
          ret[i].usuario = ret[i].usuario.toString();
        }
        this.customAnswer(msg.id, msg.event, ret, null);
      }).catch((error) => {
      this.customAnswer(msg.id, msg.event, null, error);
    });
  }

  async atualizaNovaSemana(msg) {
    let ret = await this.model.findOne({'mes': msg.mes, 'ano': msg.ano})
      .exec((err, res) => {
        if (err) {

        } else {
          let semanas = msg.semanas;
          for(let i = 0; i < res.produtos.length; i++){
            if(semanas.has(res.produtos[i].produto.toString())){
              for(let j = 0; j < res.produtos[i].fontes.length; j++){
                if(semanas.get(res.produtos[i].produto.toString()).fontes.has(
                  res.produtos[i].fontes[j].fonte.toString())){
                  if(res.produtos[i].fontes[j].semanas.length < msg.semana){
                    res.produtos[i].fontes[j].semanas.push(semanas.get(res.produtos[i].produto.toString()).fontes.get(res.produtos[i].fontes[j].fonte.toString()).semana);
                    console.log(res);
                  } else {
                    throw new Error(Mensagem.SEMANA_JA_EXISTE);
                  }
                }
              }
            }
          }
          res.save((err) => {
            if (err) {
              console.log('Erro no save model do atualizaNovaSemana - Relatório', err);
            }
          });
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
    return 'relatorio_mes';
  }
}

module.exports = Relatorio_Mes;