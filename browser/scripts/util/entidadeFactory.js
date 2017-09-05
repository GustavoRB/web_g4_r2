'[use strict]';

app.factory('referencia', [function() {
  var method = {

    /**
     * Responsavel por solicitar a referencia da entidade passada por parametro.
     * precisa do this para poder jogar dentro da msg qual documento esta
     * precisando da referencia.
     *
     * @param dado
     * @param me
     */
    getReferencias: function(dado, me) {

      var minhasrefs = [];
      for (var attr in dado) {
        if (typeof dado[attr] === 'object') {
          minhasrefs.push(dado[attr]);
        }
      }
      if (minhasrefs.length > 0) {

        var msg = new Mensagem(me, 'referencia.read', minhasrefs,
          'referencia');

        SIOM.emitirServer(msg);
      }

    },
  };

  return method;
}]);