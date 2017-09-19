const Usuario = require('./Usuario');

/**
 * Inicia todos os managers.
 */
let Mongoosemodels = {
  usuario: new Usuario(),
};

module.exports = Mongoosemodels;