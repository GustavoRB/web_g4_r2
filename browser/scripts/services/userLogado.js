'[use strict]';

app.value('values', {
  user: {},
});

app.factory('set', ['values', function(values) {
  let methods = {
    logado: function(user) {
      values.user = user;
      SIOM.send_to_browser('user_setado');
    },
  };

  return methods;
}]);

app.factory('get', ['values', function(values) {
  let methods = {
    logado: function() {
      return values.user;
    },
  };

  return methods;
}]);