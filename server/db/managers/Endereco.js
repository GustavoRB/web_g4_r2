let Manager = require('./Manager');
let _model = require('../model/Endereco');

class Endereco extends Manager {
	wireCustomListeners() {
		this.hub.on("db." + this.event_name + ".findByLocation", this.findByLocation.bind(this));
	}

	async findByLocation(msg) {
		if (msg.source_id === this.id) return;

		let coords = msg.data.success.coord;
		await this.model.ensureIndexes();
		let estabelecimentos = await this.model.find({
			coordenadas: {
				$nearSphere: coords,
				$maxDistance: 2500 / 6378137
			}
		});

		this.answer(msg.id, 'findByLocation', estabelecimentos, null);
	}

	//noinspection JSMethodCanBeStatic
	/**
	 * Deve ser implementado em todas as subclasses para retornar seu devido model
	 */
	get model() {
		return _model;
	}

	//noinspection JSMethodCanBeStatic
	/**
	 * Deve ser implementado em todas as subclasses para retornar seu devido nome
	 */
	get event_name() {
		return 'endereco';
	}
}

module.exports = Endereco;