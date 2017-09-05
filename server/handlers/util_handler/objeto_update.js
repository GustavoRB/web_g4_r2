class Objeto_update{

  constructor(id, update){
    this.query = id;
    this.update = update;
  };

  set query(id) {
    this._query = {
      _id: id,
    };
  }

  get query() {
    return this._query;
  }

  set update(update){
    this._update = {
      $set: update,
    };
  }

  get update(){
    return this._update;
  }
}

module.exports = Objeto_update;