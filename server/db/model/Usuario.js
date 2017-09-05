'use strict';

const Mongoose = require('mongoose');
const types = Mongoose.Schema.Types;
const messages = require('../../util/messages.json').usuario;
const Util = require('../../util/util');

let schema_options = {
  discriminatorKey: "tipo",
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  timestamps: true
  // http://mongoosejs.com/docs/guide.html#options
};

let schema = Mongoose.Schema({
  nome: {
    type: types.String,
    trim: true,
    required: [true, messages.nome.REQUIRED]
  },
  login: {
    type: types.String,
    required: [true, messages.login.REQUIRED],
    unique: true,
  },
  senha: {
    type: types.String,
    required: [true, messages.senha.REQUIRED],
  },
  idioma: {
    type: types.ObjectId,
    ref: 'idioma'
    // required: [true, messages.idioma.REQUIRED]
  },
  logado: {
    type: types.Boolean,
    default: false
  },
  numerocelular: {
    index: {unique: true},
    type: types.String,
    required: [true, messages.numerocelular.REQUIRED]
  },
  foto: {
    type: types.String
  },
  datanascimento: {
    type: types.Date,
    //TODO uncomment after tests
    //required: [true, messages.datanascimento.REQUIRED]
  },
  ativo: {
    type: types.Boolean,
    default: true,
  },
  regiao: {
    type: types.ObjectId,
    ref: 'Regiao'
  },
  fontes: [{
    _id: false,
    fonte: {
      type: types.ObjectId,
      ref: 'Fonte'
    }
  }]
}, schema_options);

module.exports = Mongoose.model('usuario', schema);