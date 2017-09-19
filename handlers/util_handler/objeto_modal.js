/**
 * Created by Lucas on 16/06/2017.
 */
class Objeto_modal {

  constructor(titulo, descricao, botoes){
    this._titulo = titulo;
    this._descricao = descricao;
    this._botoes = botoes;
  }


  get descricao() {
    return this._descricao;
  }

  set descricao(value) {
    this._descricao = value;
  }

  get botoes() {
    return this._botoes;
  }

  set botoes(value) {
    this._botoes = value;
  }

  get titulo() {
    return this._titulo;
  }

  set titulo(value) {
    this._titulo = value;
  }

  formataParaBrowser(){

    let botoes = [];

    for(let index = 0; index < this.botoes.length; index++){
      botoes.push(this.botoes[index].formataParaBrowser());
    }

    return {
      titulo: this.titulo,
      descricao: this.descricao,
      botoes: botoes
    };
  }
}

module.exports = Objeto_modal;