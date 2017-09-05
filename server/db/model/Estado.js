'use strict';

const Mongoose = require('mongoose');
const types = Mongoose.Schema.Types;
const messages = require('../../util/messages.json').estado;

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
		required: [true, messages.nome.REQUIRED],
		trim: true
	},
	sigla: {
		type: types.String,
		required: [true, messages.sigla.REQUIRED],
		trim: true
	},
	pais: {
		type: types.ObjectId,
		required: [true, messages.pais.REQUIRED],
		ref: "Pais"
	}
}, schema_options);

module.exports = Mongoose.model('Estado', schema);
