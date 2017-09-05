let Manager = require('./Manager');
let _model = require('../model/Pais');

class Pais extends Manager {
	//noinspection JSMethodCanBeStatic
	/**
	 * Deve ser implementado em todas as subclasses para retornar seu devido
	 * model
	 */
	get model() {
		return _model;
	}

	//noinspection JSMethodCanBeStatic
	/**
	 * Deve ser implementado em todas as subclasses para retornar seu devido
	 * nome
	 */
	get event_name() {
		return 'pais';
	}
}

module.exports = Pais;