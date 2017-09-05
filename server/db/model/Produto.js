/**
 * Created by Lucas on 12/05/2017.
 */

'use strict';

const Mongoose = require('mongoose');
const types = Mongoose.Schema.Types;
const messages = require('../../util/messages.json').produto;
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
  nome: {
    type: types.String,
    required: true,
    unique: true,
  },
  codigo: {
    type: types.Number,
    required: true,
    unique: true,
  },
  ativo: {
    type: types.Boolean,
    default: true
  }
}, schema_options);

module.exports = Mongoose.model('Produto', schema);
