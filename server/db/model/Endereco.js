'use strict';

const messages = require('../../util/messages.json').endereco;
const Util = require('../../util/util');
const Mongoose = require('mongoose');
const types = Mongoose.Schema.Types;

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
	cidade: {
		type: types.ObjectId,
		required: [true, messages.cidade.REQUIRED],
		ref: 'Cidade'
	},
	logradouro: {
		type: types.String,
		required: [true, messages.logradouro.REQUIRED]
	},
	cep: {
		type: types.String
	},
	coordenadas: {
		type: [types.Number], // lng, lat
		required: [true, messages.coordenadas.REQUIRED],
		validate: {
			validator: (value) => {
				if (!Util.isArray(value)) return false;

				let lat = value[1], lng = value[0];
				return value.length === 2 && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
			},
			message: messages.coordenadas.OUT_OF_RANGE
		},
		index: "2dsphere"
	}
}, schema_options);

module.exports = Mongoose.model('Endereco', schema);
