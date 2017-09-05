/**
 * Created by Labtic on 12/05/2017.
 */
'use strict';

const Mongoose = require('mongoose');
const types = Mongoose.Schema.Types;
const messages = require('../../util/messages.json').logradouro;

let schema_options = {
  toObject: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
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
  cep: {
    type: types.Number,
    required: [true, messages.cep.REQUIRED]
  },
  bairro: {
    required: [true, messages.bairro.REQUIRED],
    type: types.ObjectId,
    ref: 'Bairro'
  },
}, schema_options);

module.exports = Mongoose.model('Logradouro', schema);

