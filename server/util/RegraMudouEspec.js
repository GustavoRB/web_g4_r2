class RegraMudouEspec {

  static verificaSeMudouEspecProdutos(produtos, produtos_sem_anterior) {
    for (let i = 0; i < produtos.length; i++) {
      if (produtos_sem_anterior.has(produtos[i].produto.toString())) {
        produtos[i].mudou_espec = RegraMudouEspec.verificaSeMudouEspec(
          produtos[i],
          produtos_sem_anterior.get(produtos[i].produto.toString())
        );
      }
    }
    return produtos;
  }

  static verificaSeMudouEspec(produto, produto_sem_anterior) {
    let produto_ref = new Object({
      espec1: produto.espec1,
      espec2: produto.espec2
    });
    let produto_sem_anterior_ref = new Object({
      espec1: produto_sem_anterior.espec1,
      espec2: produto_sem_anterior.espec2
    });
    RegraMudouEspec.arrumaTrim(produto_ref, produto_sem_anterior_ref);
    RegraMudouEspec.arrumaEspacamentoEntrePalavras(produto_ref, produto_sem_anterior_ref);
    return RegraMudouEspec.verificaToLowerCase(produto_ref, produto_sem_anterior_ref);
  }

  static verificaToLowerCase(produto, produto_sem_anterior) {
    return produto.espec1.toLowerCase() !== produto_sem_anterior.espec1.toLowerCase()
      || produto.espec2.toLowerCase() !== produto_sem_anterior.espec2.toLowerCase();
  }

  static arrumaTrim(produto, produto_sem_anterior) {
    produto.espec1 = produto.espec1.trim();
    produto.espec2 = produto.espec2.trim();
    produto_sem_anterior.espec1 = produto_sem_anterior.espec1.trim();
    produto_sem_anterior.espec2 = produto_sem_anterior.espec2.trim();
  }

  static arrumaEspacamentoEntrePalavras(produto, produto_sem_anterior) {
    let reg_coletora_espacos = new RegExp(" ", "g");
    produto.espec1 = produto.espec1.replace(reg_coletora_espacos, '');
    produto.espec2 = produto.espec2.replace(reg_coletora_espacos, '');
    produto_sem_anterior.espec1 = produto_sem_anterior.espec1.replace(reg_coletora_espacos, '');
    produto_sem_anterior.espec2 = produto_sem_anterior.espec2.replace(reg_coletora_espacos, '');
  }

}


module.exports = RegraMudouEspec;