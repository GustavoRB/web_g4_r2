'use strict';

const Mongoose = require('mongoose');
const types = Mongoose.Schema.Types;

const Usuario = require('./Usuario.js');

let schema_options = {
	toObject: {
		virtuals: true,
		transform: function(doc, ret) {
			delete ret.senha;
			delete ret._id;
			delete ret.__v;
			return ret;
		}
	},
	toJSON: {
		virtuals: true,
		transform: function(doc, ret) {
      delete ret.senha;
			delete ret._id;
			delete ret.__v;
			return ret;
		}
	},
	timestamps: true
	// http://mongoosejs.com/docs/guide.html#options
};

let schema = new Mongoose.Schema({}, schema_options);

let discriminated = Usuario.discriminator('admin', schema);

module.exports = Mongoose.model('admin', discriminated.schema);