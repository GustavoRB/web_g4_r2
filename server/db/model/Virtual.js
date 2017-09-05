/**
 * Created by Lucas on 12/05/2017.
 */
'use strict';

const Mongoose = require('mongoose');
const types = Mongoose.Schema.Types;

const Fonte = require('./Fonte.js');

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

let schema = new Mongoose.Schema({
  site: {
    type: types.String
  }
}, schema_options);

let discriminated = Fonte.discriminator('Virtual', schema);

module.exports = Mongoose.model('Virtual', discriminated.schema);
