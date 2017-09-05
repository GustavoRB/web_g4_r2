/**
 * Created by Lucas on 12/05/2017.
 */
'use strict';

const Mongoose = require('mongoose');
const types = Mongoose.Schema.Types;
const messages = require('../../util/messages.json').relatorio_mes;
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
  ano: {
    type: types.Number

  },
  mes: {
    type: types.Number
  },
  ponderador_total : {
    type: types.Number
  },
  inflacao: {
    type: types.Number
  },
  produtos: [{
    produto: {
      type: types.ObjectId,
      ref: 'Produto'
    },
    variacao: {
      type: types.Number
    },
    ipcs: [{
      semana: {
        type: types.Number
      },
      indice: {
        type: types.Number
      }
    }],
    ponderadores: {
      anterior: {
        type: types.Number
      },
      atual: {
        type: types.Number
      }
    },
    fontes: [{
      fonte: {
        type: types.ObjectId,
        ref: 'fonte'
      },
      semanas: [{
        _id: false,
        semana_anterior: {
          numero: {
            type: types.Number
          },
          preco: {
            type: types.Number
          }
        },
        semana_atual: {
          numero: {
            type: types.Number
          },
          preco: {
            type: types.Number
          },
          mudou_espec: {
            type: types.Boolean
          }
        }
      }]
    }]
  }]

}, schema_options);

module.exports = Mongoose.model('Relatorio_Mes', schema);
