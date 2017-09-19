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
  produtos: {
    type: [{
      nome: {
        type: types.String,
        required: [true, "É obrigatório o nome do produto."],
      },
      custo: {
        type: types.Number,
        required: [true, "É obrigatório ter custo no produto."],
      },
    }],
    default: [],
  }
}, schema_options);

module.exports = Mongoose.model('usuario', schema);