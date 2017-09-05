'use strict';

const BBPromise = require("bluebird");
const uuid = require("node-uuid");

class Mensagem {
	constructor(sourceId, event, data, idPreviusMessage) {
		this.id = uuid();
		this.data = data; // {error: error, success: success}
		this.source_id = sourceId;
		this.previous_message = idPreviusMessage;
		this.event = event;
	}

	set source_id(source_id) {
		this._source_id = source_id;
	}

	get source_id() {
		return this._source_id;
	}

	set id(id) {
		this._id = id;
	}

	get id() {
		return this._id;
	}

	set previous_message(previous_message) {
		this._previous_message = previous_message;
	}

	get previous_message() {
		return this._previous_message;
	}

	set data(data) {
		if (!data || !data.hasOwnProperty('success') || !data.hasOwnProperty('error'))
			throw new Error(`Mensagem no formato incorreto. 
											 Esperado: {success: any, error: any}. 
											 Recebido ${JSON.stringify(data)}`);

		this._data = data;
	}

	get data() {
		return this._data;
	}

	set event(event) {
		this._event = event;
	}

	get event() {
		return this._event;
	}

	set promise(promise) {
		this._promise = promise;
	}

	get promise() {
		if (this._promise) return this._promise;

		let hub = require("./hub");
		let promiseHandler = null;
		this.promise = new BBPromise((resolve) => {
			promiseHandler = (message) => {
				if (this.id === message.previous_message) {
					hub.un(this.event, promiseHandler);
					return resolve(message);
				}
			}
		});
		hub.on(this.event, promiseHandler);
		this.promise.timeout(30000).catch((e) => {// If we have an catch/timeout remove this from HUB;
			console.log("error", e);
			hub.un(this.event, promiseHandler);
		});

		return this._promise;
	}
}

module.exports = Mensagem;
