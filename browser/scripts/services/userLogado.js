app.value('userLogado', {
  user: {},
});

app.factory('setUserLogado', ['userLogado', function(userLogado) {
  var methods = {
    setLogado: function(user) {
      userLogado.user = user;
    },
  };

  return methods;
}]);

app.factory('getUserLogado', ['userLogado', function(userLogado) {
  var methods = {
    getLogado: function() {
      return userLogado.user;
    },
  };

  return methods;
}]);