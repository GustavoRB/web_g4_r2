/**
 * Created by Gustavo on 05/09/2017.
 */

app.controller('fabricanteController', [
  '$scope',
  function ($scope) {

    $scope.fornecedor_nome = 'Fornecedor 1';
    $scope.produtos_fabricante = [{
      nome: 'Produto 1',
      custo: 23
    },{
      nome: 'Produto 3',
      custo: 5
    },{
      nome: 'Produto 4',
      custo: 40
    }];

    /**
     * Adiciona um produto novo ao fornecedor
     */
    $scope.novo_produto = function () {
      $scope.produtos_fabricante.push({
        nome: 'Produto 1',
        custo: null
      });
    };

    /**
     * Remove um produto da lista do fornecedor
     *
     * @param index(Number): index do produto
     */
    $scope.remove_produto = function (index) {
      $scope.produtos_fabricante.splice(index, 1);
    };

    /**
     * Salva todas as mudancas feitas pelo fornecedor
     */
    $scope.salvar = function () {

    };

}]);