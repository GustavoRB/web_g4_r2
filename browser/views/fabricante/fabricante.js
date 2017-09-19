/**
 * Created by Gustavo on 05/09/2017.
 */

app.controller('fabricanteController', [
  '$scope',
  '$location',
  'getUserLogado',
  '$http',
  function ($scope, $location, getUserLogado, $http) {

    let listeners = [];
    $scope.user = {};

    /**
     * Adiciona um produto novo ao fornecedor
     */
    $scope.novo_produto = function () {
      $scope.user.produtos.push({
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
      $scope.user.produtos.splice(index, 1);
    };

    /**
     * Salva todas as mudancas feitas pelo fornecedor
     */
    $scope.salvar = function () {

      let data = {
        user_id: $scope.user.id,
        products: $scope.user.produtos
      };

      let msg = new Mensagem(
        'product_save',
        data,
        'ret_product_save'
        , this
      );
      SIOM.send_to_server(msg);

    };

    /**
     * Usuario desloga do sistema
     */
    $scope.deslogar = function () {
      $location.path('/');
      location.reload();
      let msg = new Mensagem(
        'logout',
        {},
        'ret_logout'
        , this
      );
      SIOM.send_to_server(msg);
    };

    let ret_product_save = function (msg) {
      if (msg._dados.success) {
        console.log('ret_product_save');
      }
    };

    let ret_logout = function (msg) {
      if (msg._dados.success) {
      }
    };


    let ready = function () {

      $scope.user = getUserLogado.getLogado();
      console.log('$scope.user ', $scope.user );

      jQuery.ajax({
        url: "https://ine5646products.herokuapp.com/api/products",
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        type: "GET",
        dataType: "json",
        success: function(ret) {
          console.log('ret', ret);
        },
        error : function(err) {
          console.log('err', err);
        },
        timeout: 120000,
      });


      // $.getJSON("https://ine5646products.herokuapp.com/api/products", function(ret) {
      //   //data is the JSON string
      //   console.log('ret', ret);
      // });
    };

    let wiring = function () {

      listeners['ret_product_save'] = ret_product_save.bind(this);
      listeners['ret_logout'] = ret_logout.bind(this);

      for (let name in listeners) {
        if (listeners.hasOwnProperty(name)) {

          SIOM.on(name, listeners[name]);

        }
      }

      ready();

    };

    wiring();

  }]);