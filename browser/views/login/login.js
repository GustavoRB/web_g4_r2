/**
 * Created by Gustavo on 15/09/2017.
 */

app.controller('loginController', [
  '$scope',
  '$location',
  '$route',
  'setUserLogado',
  function ($scope, $location, $route, setUserLogado) {

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
    $scope.logar = function (login) {
      let msg = new Mensagem(
        'logar',
        login,
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
        $scope.novo_user,
        'ret_fabricante_create'
        , this
      );
      SIOM.send_to_server(msg);

    };

    let ret_fabricante_create = function (msg) {
      if (msg._dados.success) {
        let login = {
          login: msg._dados.data[0].login,
          senha: msg._dados.data[0].senha
        };

        $scope.logar(login);
      }
    };

    let ret_login = function (msg) {
      $scope.$apply(() => {
        if (msg._dados.success) {
          setUserLogado.setLogado(msg._dados.data[0]);
          $location.path('/gerencia');
        }
      })
    };

    let wiring = function () {

      listeners['ret_fabricante_create'] = ret_fabricante_create.bind(this);
      listeners['ret_login'] = ret_login.bind(this);

      for (let name in listeners) {
        if (listeners.hasOwnProperty(name)) {

          SIOM.on(name, listeners[name]);

        }
      }

    };

    wiring();


  }]);