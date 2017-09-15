'use strict';

const Mongoose = require('mongoose');
const Source = require('../eventos/source');

class Banco extends Source{
	constructor(config) {
		super();
		this.mongoose = Mongoose;
		this.mongoose.Promise = global.Promise;
		this.managers = {};

		let db = this.mongoose.connection;

		db.on('error', function(err, val) {
			return console.log('error', err, val);
		});

		this.hub.on('db.getManager', this.getManager.bind(this));

		this.init(config.mongodb);
	}

	init(config) {
		this.mongoose.connect(`mongodb://${config.local}/${config.nome}`)
			.then(
				async () => {
					if (config.erase_db) {
						await this.mongoose.connection.db.dropDatabase();
					}

					this.managers = require('./managers/index');
					this.hub.send(this, 'banco.ready', {success: true, error: false});
				})
			.catch((e) => {
				console.error(e);
				process.exit(1);
			});
	}

	async destroy() {
		try {
			await this.mongoose.connection.close();
		} catch (e) {
			console.error(e);
			process.exit(1);
		}
	}

	getManager(msg) {
		if (msg.source === this.getId()) return;

		let manager = msg.data.success;
		this.hub.send(this, 'db.getManager', this.managers[manager], msg.id);
	}
}

module.exports = Banco;