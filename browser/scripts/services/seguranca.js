'[use strict]';
/**
 * Created by Osvaldo on 26/06/2016.
 */

app.factory('seguranca', ['md5', function(md5) {
  var methods = {
    hash: function(value) {
      return md5.createHash(value);
    },
    empacota: function(value) {
      return sjcl.codec.utf8String.toBits(value);
    },
    cifra: function(value) {
      return sjcl.encrypt(value.senha, JSON.stringify(value), {mode: 'ocb2'});
    },
    verificaAutenticacao: function (dado, nonce, senhaHash) {
      var cifra = dado.cifra;
      var ret = {
        res: false,
        err: false
      };

      try{
        var dec = JSON.parse(sjcl.decrypt(senhaHash, cifra.ret));
        if((dec.nonce - cifra.serverNonce) === nonce){
          ret.res = dado.user;
          return ret;
        } else {
          ret.err = 'error 2424';
          return ret;
        }
      } catch (e){
        ret.err = 'error 6969, '+e;
        return ret;
      }
    }
  };

  return methods;
}]);