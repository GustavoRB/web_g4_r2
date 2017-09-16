/**
 * Created by Gustavo on 05/09/2017.
 */

app.controller('fabricanteController', [
  '$scope',
  '$location',
  function ($scope, $location) {

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
      //todo salvar lista
    };

    /**
     * Usuario desloga do sistema
     */
    $scope.deslogar = function () {
      $location.path('/');
      location.reload();
    };

    //todo pegar dados do produto
    // jQuery.ajax({
    //   url: "/rest/abc",
    //   type: "GET",
    //   contentType: 'application/json; charset=utf-8',
    //   success: function(ret) {
    //     console.log('ret', ret);
    //   },
    //   error : function(err) {
    //     console.log('err', err);
    //   },
    //   timeout: 120000,
    // });

}]);