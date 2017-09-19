'use strict';

const chai = require('chai');
const TestManager = require('../TestManager');

let expect = chai.expect;

let testManager = null;
let tipo_comida = null;

describe('Teste de manager tipo_comida', () => {
	before(function(done) {
		testManager = new TestManager(done);
	});

	after(async () => {
		await testManager.destroy();
	});

	it('1. teste de create', async () => {
		let ret = await testManager.hub.send(testManager, "db.tipo_comida.create", {
			success: { tipo: "Nome" },
			error: null
		}).promise;

		expect(ret.data.success.length).to.be.equals(1);
		tipo_comida = ret.data.success[0];
		expect(tipo_comida.tipo).to.be.equals("Nome");
	});

	it('2. teste de read', async () => {
		let ret = await testManager.hub.send(testManager, "db.tipo_comida.read", {
			success: {_id: tipo_comida._id},
			error: null
		}).promise;

		let tipo_comida_read = ret.data.success;
		expect(tipo_comida_read.length).to.be.equals(1);
		expect(tipo_comida_read[0].tipo).to.be.equals("Nome");
		expect(ret.data.error).to.be.equals(null);
	});

	it ('3. teste de update', async () => {
		await testManager.hub.send(testManager, "db.tipo_comida.update", {
			success: {
				query: { _id: tipo_comida._id },
				update: { tipo: "Novo tipo" }
			},
			error: null
		}).promise;

		let ret = await testManager.hub.send(testManager, "db.tipo_comida.read", {
			success: {_id: tipo_comida._id},
			error: null
		}).promise;

		let tipo_comida_read = ret.data.success;
		expect(tipo_comida_read.length).to.be.equals(1);
		expect(tipo_comida_read[0].tipo).to.be.equals("Novo tipo");
		expect(ret.data.error).to.be.equals(null);
	});

	it ('4. teste de delete', async () => {
		await testManager.hub.send(testManager, "db.tipo_comida.delete", {
			success: { _id: tipo_comida._id },
			error: null
		});

		let ret = await testManager.hub.send(testManager, "db.tipo_comida.read", {
			success: { _id: tipo_comida._id },
			error: null
		}).promise;

		let tipo_comida_read = ret.data.success;
		expect(tipo_comida_read.length).to.be.equals(0);
		expect(ret.data.error).to.be.equals(null);
	});

	// it ('11. teste de create sem tipo', async () => {
	// 	let ret = await testManager.hub.send(testManager, "db.tipo_comida.create", {
	// 		success: {},
	// 		error: null
	// 	}).promise;
	//
	// 	expect(ret.data.success).to.be.equals(null);
	// 	expect(ret.data.error.errors.tipo.message).to.be.equals('Idioma deve ter um tipo.');
	// });
});

