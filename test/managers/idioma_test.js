'use strict';

const path = require('path');
const chai = require('chai');
const chaihttp = require('chai-http');
const HttpStatus = require('http-status-codes');
const TestManager = require('../TestManager');

chai.use(chaihttp);

let should = chai.should();
let expect = chai.expect;

let testManager = null;
let idioma = null;

describe('Teste de manager idioma', () => {
	before(function(done) {
		testManager = new TestManager(done);
	});

	after(async function() {
		await testManager.destroy();
	});

	it('1. teste de create', async () => {
		let ret = await testManager.hub.send(testManager, "db.idioma.create", {
			success: { nome: "Nome" },
			error: null
		}).promise;

		expect(ret.data.success.length).to.be.equals(1);
		idioma = ret.data.success[0];
		expect(idioma.nome).to.be.equals("Nome");
	});

	it('2. teste de read', async () => {
		let ret = await testManager.hub.send(testManager, "db.idioma.read", {
			success: {_id: idioma.id},
			error: null
		}).promise;

		let idioma_read = ret.data.success;
		expect(idioma_read.length).to.be.equals(1);
		expect(idioma_read[0].nome).to.be.equals("Nome");
		expect(ret.data.error).to.be.equals(null);
	});

	it ('3. teste de update', async () => {
		await testManager.hub.send(testManager, "db.idioma.update", {
			success: {
				query: { _id: idioma.id },
				update: { nome: "Novo nome" }
			},
			error: null
		}).promise;

		let ret = await testManager.hub.send(testManager, "db.idioma.read", {
			success: {_id: idioma.id},
			error: null
		}).promise;

		let idioma_read = ret.data.success;
		expect(idioma_read.length).to.be.equals(1);
		expect(idioma_read[0].nome).to.be.equals("Novo nome");
		expect(ret.data.error).to.be.equals(null);
	});

	it ('4. teste de delete', async () => {
		await testManager.hub.send(testManager, "db.idioma.delete", {
			success: { _id: idioma.id },
			error: null
		});

		let ret = await testManager.hub.send(testManager, "db.idioma.read", {
			success: { _id: idioma.id },
			error: null
		}).promise;

		let idioma_read = ret.data.success;
		expect(idioma_read.length).to.be.equals(0);
		expect(ret.data.error).to.be.equals(null);
	});

	it ('11. teste de create sem nome', async () => {
		let ret = await testManager.hub.send(testManager, "db.idioma.create", {
			success: {},
			error: null
		}).promise;

		expect(ret.data.success).to.be.equals(null);
		expect(ret.data.error.errors.nome.message).to.be.equals('Idioma deve ter um nome.');
	});

	it ('12. teste de create nome \'\'', async () => {
		let ret = await testManager.hub.send(testManager, "db.idioma.create", {
			success: {nome: ''},
			error: null
		}).promise;

		expect(ret.data.success).to.be.equals(null);
		expect(ret.data.error.errors.nome.message).to.be.equals('Idioma deve ter um nome.');
	});

	it ('13. teste de create nome null', async () => {
		let ret = await testManager.hub.send(testManager, "db.idioma.create", {
			success: {nome: null},
			error: null
		}).promise;

		expect(ret.data.success).to.be.equals(null);
		expect(ret.data.error.errors.nome.message).to.be.equals('Idioma deve ter um nome.');
	});

	it ('14. teste de create nome undefined', async () => {
		let ret = await testManager.hub.send(testManager, "db.idioma.create", {
			success: {nome: undefined},
			error: null
		}).promise;

		expect(ret.data.success).to.be.equals(null);
		expect(ret.data.error.errors.nome.message).to.be.equals('Idioma deve ter um nome.');
	});
});

