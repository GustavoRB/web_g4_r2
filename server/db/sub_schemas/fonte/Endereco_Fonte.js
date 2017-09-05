'use strict';

const Mongoose = require('mongoose');
const types = Mongoose.Schema.Types;
const messages = require('../../../util/messages.json').cliente.cartoes.cartao;

let schema_options = {
  _id: false
};

let schema = new Mongoose.Schema({
    logradouro: {
      type: types.String,
      required: true,
      trim: true
    },
    numero: {
      type: types.String,
      required: true,
      trim: true
    },
    complemento: {
      type: types.String,
      trim: true
    },
    bairro: {
      type: types.String,
      required: true,
      trim: true
    },
    cidade: {
      type: types.String,
      required: true,
      trim: true
    },
    estado: {
      type: types.String,
      required: true,
      trim: true
    },
    pais: {
      type: types.String,
      required: true,
      trim: true
    },
    cep: {
      type: types.String,
      required: true,
      trim: true
    },
    telefone: {
      type: types.String,
      required: true,
      trim: true
    }
}, schema_options);

module.exports = schema;