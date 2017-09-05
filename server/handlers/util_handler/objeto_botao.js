/**
 * Created by Lucas on 19/06/2017.
 */

class Botao {

  constructor(label, funcao){
    this._label = label;
    this._funcao = funcao;
  }


  get label() {
    return this._label;
  }

  set label(value) {
    this._label = value;
  }

  get funcao() {
    return this._funcao;
  }

  set funcao(value) {
    this._funcao = value;
  }

  formataParaBrowser(){
    return {
      label: this.label,
      funcao: this.funcao
    };
  }
}

module.exports = Botao;