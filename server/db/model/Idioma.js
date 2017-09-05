'use strict';

const Mongoose = require('mongoose');
const types = Mongoose.Schema.Types;
const messages = require('../../util/messages.json').idioma;

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
	}
	// http://mongoosejs.com/docs/guide.html#options
};

let schema = Mongoose.Schema({
  nome: {
  	type: types.String,
	  required: [true, messages.nome.REQUIRED],
	  trim: true
  },
	locale: {
  	type: types.String,
		required: true,
		trim: true
	}
}, schema_options);

module.exports = Mongoose.model('idioma', schema);