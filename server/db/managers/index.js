const Admin = require('./Admin');
const Cidade = require('./Cidade');
const Endereco = require('./Endereco');
const Estado = require('./Estado');
const Idioma = require('./Idioma');
const Pais = require('./Pais');
const Usuario = require('./Usuario');
const Regiao = require('./Regiao');
const Logradouro = require('./Logradouro');
const Bairro = require('./Bairro');
const Fonte = require('./Fonte');
const Produto = require('./Produto');
const Relatorio_Mes = require('./Relatorio_Mes');
const Pesquisa = require('./Pesquisa');
const Fisica = require('./Fisica');

/**
 * Inicia todos os managers.
 */
let Mongoosemodels = {
  idioma: new Idioma(),
  usuario: new Usuario(),
  admin: new Admin(),
  pais: new Pais(),
  estado: new Estado(),
  cidade: new Cidade(),
  endereco: new Endereco(),
  regiao: new Regiao(),
  logradouro: new Logradouro(),
  bairro: new Bairro(),
  fonte: new Fonte(),
  produto : new Produto(),
  relatorio_mes : new Relatorio_Mes(),
  pesquisa: new Pesquisa(),
  fisica: new Fisica()
};

module.exports = Mongoosemodels;