/**
 * Created by Gustavo on 15/09/2017.
 */

app.controller('loginController', [
  '$scope',
  '$location',
  '$route',
  function ($scope, $location, $route) {

    let listeners = [];
    $scope.modo_logar = true;
    $scope.user = {
      login: '',
      senha: '',
    };
    $scope.novo_user = {
      nome: '',
      login: '',
      senha: ''
    };

    /**
     * Loga o usuario no sistema
     */
    $scope.logar = function () {

      // $location.path('/gerencia');
      let msg = new Mensagem(
        'logar',
        $scope.user,
        'ret_login'
        , this
      );
      SIOM.send_to_server(msg);

    };

    /**
     * Altera entre menu de cadastro/logar
     */
    $scope.toggle_menu = function () {
      $scope.modo_logar = !$scope.modo_logar;
    };

    /**
     * Cria um usuario novo
     */
    $scope.criar_usuario = function () {

      let msg = new Mensagem(
        'fabricante_create',
        {establishment_id: this.estabelecimento_selecionado.id},
        'ret_fabricante_create'
        , this
      );
      SIOM.send_to_server(msg);

    };

    let ret_fabricante_create = function (msg) {
      console.log('ret_fabricante_create', msg);
    };

    let ret_login = function (msg) {
      console.log('ret_login', msg);
    };

    let wiring = function () {

      listeners['ret_fabricante_create'] = ret_fabricante_create.bind(this);
      listeners['logar'] = ret_login.bind(this);

      for (let name in listeners) {
        if (listeners.hasOwnProperty(name)) {

          SIOM.on(name, listeners[name]);

        }
      }

    };

    wiring();


  }]);