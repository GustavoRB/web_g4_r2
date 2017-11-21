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
    $scope.produtos = [];
    $scope.req_products_error = false;
    $scope.popup = {
      msg_error: ''
    };

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

      for(let index in $scope.user.produtos) {
        if (!$scope.user.produtos[index].nome || !$scope.user.produtos[index].custo) {
          console.log('produto incompleto', $scope.user.produtos[index]);
          return;
        }
      }

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
      setTimeout(() => {location.reload();}, 500);

      let msg = new Mensagem(
        'logout',
        {},
        'ret_logout'
        , this
      );
      SIOM.send_to_server(msg);
    };

    let ret_product_save = function (msg) {
      console.log('ret_product_save', msg);
      if (msg._dados.success) {}
    };

    let ret_logout = function (msg) {
      if (msg._dados.success) {
      }
    };

    let ready = function () {

      $scope.user = getUserLogado.getLogado();
      request_products();
      console.log('$scope.user ', $scope.user );



    };

    let request_products = function () {

      let msg = new Mensagem(
        'request_products',
        $scope.novo_user,
        'ret_request_products'
        , this
      );
      SIOM.send_to_server(msg);

    };

    let ret_request_products = function (msg) {
      console.log('msg', msg);
      $scope.$apply(() => {
        if (msg._dados.success) {

          $scope.req_products_error = false;
          $scope.produtos = msg._dados.data;

        } else if (!$scope.req_products_error) {

          $scope.req_products_error = true;
          $scope.popup.msg_error = msg._dados.data;
          $('#popup_error').modal('show');

          let retry = setInterval(() => {
            if ($scope.req_products_error) {
              request_products();
            } else {
              clearInterval(retry);
            }
          }, 5000);

        }
      });
    };

    let wiring = function () {

      listeners['ret_product_save'] = ret_product_save.bind(this);
      listeners['ret_logout'] = ret_logout.bind(this);
      listeners['ret_request_products'] = ret_request_products.bind(this);

      for (let name in listeners) {
        if (listeners.hasOwnProperty(name)) {

          SIOM.on(name, listeners[name]);

        }
      }

      ready();

    };

    wiring();

  }]);