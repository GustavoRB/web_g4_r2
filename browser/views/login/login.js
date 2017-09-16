/**
 * Created by Gustavo on 15/09/2017.
 */

app.controller('loginController', [
  '$scope',
  function ($scope) {

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

    };

    /**
     * Cria um usuario novo
     */
    $scope.criar_usuario = function () {

    };


  }]);