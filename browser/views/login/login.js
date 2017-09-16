/**
 * Created by Gustavo on 15/09/2017.
 */

app.controller('loginController', [
  '$scope',
  '$location',
  '$route',
  function ($scope, $location, $route) {

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
      //todo logar usuario
      $location.path('/gerencia');
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
      //todo criar usuario
    };


  }]);