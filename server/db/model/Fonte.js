/**
 * Created by Lucas on 12/05/2017.
 */
'use strict';

const Mongoose = require('mongoose');
const types = Mongoose.Schema.Types;
const messages = require('../../util/messages.json').fonte;

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
    required: [true, messages.nome.REQUIRED]
  },
  produtos: [{
    produto: {
      type: types.ObjectId,
      ref: 'Produto'
    }
  }],
  telefone: {
    type: types.String
  },
  pesquisadores: [{
    data_desvinculacao: {
      type: types.Date
    },
    data_vinculacao: {
      type: types.Date
    },
    usuario: {
      type: types.ObjectId,
      ref: 'usuario'
    }
  }],
  ativo: {
    type: types.Boolean,
    default: true,
  }


}, schema_options);

module.exports = Mongoose.model('Fonte', schema);
