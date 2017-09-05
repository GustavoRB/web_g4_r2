'use strict';

const Mongoose = require('mongoose');
const types = Mongoose.Schema.Types;
const messages = require('../../util/messages.json').cidade;

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
	estado: {
		required: [true, messages.estado.REQUIRED],
		type: types.ObjectId,
		ref: 'Estado'
	}
}, schema_options);

module.exports = Mongoose.model('Cidade', schema);
