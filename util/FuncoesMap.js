class FuncoesMap {

  static produtosDBToHash(array){
    let map = new Map();
    for(let i = 0; i < array.length; i++){
      map.set(array[i].produto.toString(), array[i]);
    }
    return map;
  }

  static produtosToHash(array){
    let map = new Map();
    for(let i = 0; i < array.length; i++){
      map.set(array[i].produto, array[i]);
    }
    return map;
  }

  static fontesDBToHash(fontes){
    let map = new Map();
    for(let i = 0; i < fontes.length; i++){
      map.set(fontes[i].fonte.toString(), fontes[i]);
    }
    return map;
  }

  static fontesToHash(fontes){
    let map = new Map();
    for(let i = 0; i < fontes.length; i++){
      map.set(fontes[i].fonte, fontes[i]);
    }
    return map;
  }

  static novasSemanasRelatorioToHash(semanas_relatorio){
    let map_produtos = new Map();
    for(let i = 0; i < semanas_relatorio.length; i++){
      semanas_relatorio[i].fontes = FuncoesMap.fontesToHash(semanas_relatorio[i].fontes);
      map_produtos.set(semanas_relatorio[i].produto, semanas_relatorio[i]);
    }
    return map_produtos;
  }

}


module.exports = FuncoesMap;