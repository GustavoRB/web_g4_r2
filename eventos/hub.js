'use strict';

const EventEmitter2 = require('eventemitter2').EventEmitter2;
const config = require('../config.json').eventConfig;
const BBPromise = require('bluebird');
const Mensagem = require('./mensagem');

let instance = null;

class Hub {
	constructor() {
		if (!instance) {
			instance = this;
			this.eventemitter = new EventEmitter2(config);
		}

		return instance;
	}

	/**
	 * Adds a listener to the end of the listeners array for the specified event.
	 * @param event
	 * @param listener
	 */
	on(event, listener) {
		this.eventemitter.on(event, listener);
		return this;
	}

	/**
	 * Adds a one time listener for the event.
	 * The listener is invoked only the first time the event is fired, after which it is removed.
	 * @param event
	 * @param listener
	 */
	once(event, listener) {
		this.eventemitter.once(event, listener);
		return this;
	}

	/**
	 * Remove a listener from the listener array for the specified event.
	 * Caution: changes array indices in the listener array behind the listener.
	 * @param event
	 * @param listener
	 */
	un(event, listener) {
		this.eventemitter.off(event, listener);
		return this;
	}

	/**
	 * Send a message into the HUB.
	 *
	 * @param source
	 * @param event
	 * @param data
	 * @param idMessage
	 * @return {Mensagem}
	 */
	send(source, event, data, idMessage) {
		let Source = require('./source');
		if (!source || (typeof source !== "object" && !(source instanceof Source))) {
			throw new Error("To send message through Hub, the source is required " +
				"and must extend Source");
		}

		let msg = new Mensagem(source.id, event, data, idMessage);
		process.nextTick(() => {
			try {
				this.eventemitter.emit(event, msg);
			} catch (e) {
				console.error("Tentando enviar dados para um HUB Destruido", event, source, e);
			}
		});

		return msg;
	}

	destroy() {
		return new BBPromise((resolve) => {
			Hub.instance = null;
			this.eventemitter.removeAllListeners();
			this.eventemitter = null;
			resolve(true);
		});
	}
}

module.exports = new Hub();