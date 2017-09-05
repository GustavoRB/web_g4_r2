class Mensagem{
  constructor(evento, dados, evento_retorno, source, id){
    this.id = id ? id : lil.uuid();
    this.evento = evento;
    this.dados = dados;
    this.evento_retorno = evento_retorno;
    this.source = source;
  }

  set id(id){
    if(!lil.isUUID(id)){
      throw new Error("O id da Mensagem é incompativel!");
    }
    this._id = id;
  }

  get id(){
    return this._id;
  }

  set evento(evento){
    this._evento = evento;
  }

  get evento(){
    return this._evento;
  }

  set dados(dados){
    this._dados = dados;
  }

  get dados(){
    return this._dados;
  }

  set evento_retorno(evento_retorno){
    this._evento_retorno = evento_retorno;
  }

  get evento_retorno(){
    return this._evento_retorno;
  }

  set source(source){
    if(!source || typeof source !== 'object'){
      throw new Error('Não é possivel criar mensagem sem um source valido');
    }
    this._source = source;
  }

  get source(){
    return this._source;
  }

  to_server(){
    return {
      id: this.id,
      evento: this.evento,
      dados: this.dados,
    }
  }

}

window.Mensagem = Mensagem;