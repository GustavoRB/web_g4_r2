

class Dado_retorno{

  constructor(issuccess, data){
    this.issuccess = issuccess;
    this.data = data;
  }

  set issuccess(issuccess){
    this._issuccess = issuccess;
  }

  get issuccess(){
    return this._issuccess;
  }

  set data(data){
    this._data = data;
  }

  get data(){
    return this._data;
  }

}

module.exports = Dado_retorno;