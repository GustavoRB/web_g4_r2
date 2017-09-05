/**
 * Created by Lucas on 12/05/2017.
 */

'use strict';

const Mongoose = require('mongoose');
const types = Mongoose.Schema.Types;
const messages = require('../../util/messages.json').pesquisa;
const Util = require('../../util/util');

let schema_options = {
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
  usuario: {
    type: types.ObjectId,
    ref: 'usuario',
  },
  ano: {
    type: types.Number,
    required: true
  },
  mes: {
    type: types.Number,
    required: true
  },
  fechada: {
    type: types.Boolean,
    default: false
  },
  fontes: [{
    _id: false,
    fonte: {
      type: types.ObjectId,
      ref: 'Fonte'
    },
    semanas: [{
      _id: false,
      numero: {
        type: types.Number
      },
      fechada: {
        type: types.Boolean,
        default: false
      },
      semana_anterior: {
        numero: {
          type: types.Number
        },
        produtos: [{
          _id: false,
          produto: {
            type: types.ObjectId,
            ref: 'Produto'
          },
          preco: {
            type: types.Number
          },
          espec1:{
            type: types.String
          },
          espec2: {
            type: types.String
          },
          mudou_espec: {
            type: types.Boolean,
            default: false
          },
          promocao: {
            type: types.Boolean,
            default: false
          }
        }],
        fechada: {
          type: types.Boolean
        }
      },
      produtos: [{
        _id: false,
        produto: {
          type: types.ObjectId,
          ref: 'Produto'
        },
        preco: {
          type: types.Number
        },
        espec1:{
          type: types.String
        },
        espec2: {
          type: types.String
        },
        mudou_espec: {
          type: types.Boolean,
          default: false
        },
        promocao: {
          type: types.Boolean,
          default: false
        }
      }]
    }]
  }]
}, schema_options);

module.exports = Mongoose.model('Pesquisa', schema);
