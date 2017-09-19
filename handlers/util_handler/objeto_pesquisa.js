class Objeto_pesquisa{

  constructor(query, select, populate, limit,  page){
    this.query = query;
    this.select = select;
    this.populate = populate || "";
    this.limit = limit || 25;
    this.page = page || 1;
  };

  set query(query) {
    this._query = query;
  }

  get query() {
    return this._query;
  }

  set limit(limit){
    if(limit){
      limit = typeof limit === 'number' ? limit : parseInt(limit);
    }

    this._limit = limit;
  }

  get limit(){
    return this._limit;
  }

  set select(seletc){
    this._select = seletc;
  }

  get select(){
    return this._select;
  }

  set populate(populate){
    this._populate = populate;
  }

  get populate(){
    return this._populate;
  }

  set page(page){
    this._page = page;
  }

  get page(){
    return this._page;
  }
}

module.exports = Objeto_pesquisa;