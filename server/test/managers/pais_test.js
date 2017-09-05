'use strict';

const chai = require('chai');
const chaihttp = require('chai-http');
const TestManager = require('../TestManager');

chai.use(chaihttp);

let should = chai.should();
let expect = chai.expect;

let testManager = null;
let pais = null;

describe('Teste de manager país', () => {
	before(function(done) {
		testManager = new TestManager(done);
	});

	after(async function() {
		await testManager.destroy();
	});

	it('1. teste de create', async () => {
		let ret = await testManager.hub.send(testManager, "db.pais.create", {
			success: { nome: "Nome", sigla: "NO"},
			error: null
		}).promise;

		pais = ret.data.success[0];
		expect(pais.sigla).to.be.equals("NO");
		expect(pais.nome).to.be.equals("Nome");
		expect(ret.data.success.length).to.be.equals(1);
	});

	it('2. teste de read', async () => {
		let ret = await testManager.hub.send(testManager, "db.pais.read", {
			success: { _id: pais.id },
			error: null
		}).promise;

		let pais_read = ret.data.success;
		expect(pais_read.length).to.be.equals(1);
		expect(pais_read[0].nome).to.be.equals("Nome");
		expect(pais_read[0].sigla).to.be.equals("NO");
		expect(ret.data.error).to.be.equals(null);
	});

	it ('3. teste de update', async () => {
		await testManager.hub.send(testManager, "db.pais.update", {
			success: {
				query: { _id: pais.id },
				update: { nome: "Novo nome", sigla: 'Nova sigla' }
			},
			error: null
		}).promise;

		let ret = await testManager.hub.send(testManager, "db.pais.read", {
			success: {_id: pais.id},
			error: null
		}).promise;

		let pais_read = ret.data.success;
		expect(pais_read.length).to.be.equals(1);
		expect(pais_read[0].nome).to.be.equals("Novo nome");
		expect(pais_read[0].sigla).to.be.equals("Nova sigla");
		expect(ret.data.error).to.be.equals(null);
	});

	it ('4. teste de delete', async () => {
		await testManager.hub.send(testManager, "db.pais.delete", {
			success: { _id: pais.id },
			error: null
		});

		let ret = await testManager.hub.send(testManager, "db.pais.read", {
			success: { _id: pais.id },
			error: null
		}).promise;

		let pais_read = ret.data.success;
		expect(pais_read.length).to.be.equals(0);
		expect(ret.data.error).to.be.equals(null);
	});

	it ('11. teste de create sem nome', async () => {
		let ret = await testManager.hub.send(testManager, "db.pais.create", {
			success: {sigla: "NO"},
			error: null
		}).promise;

		expect(ret.data.success).to.be.equals(null);
		expect(ret.data.error.errors.nome.message).to.be.equals('País deve ter um nome.');
	});

	it ('12. teste de create nome \'\'', async () => {
		let ret = await testManager.hub.send(testManager, "db.pais.create", {
			success: {nome: '', sigla: "NO"},
			error: null
		}).promise;

		expect(ret.data.success).to.be.equals(null);
		expect(ret.data.error.errors.nome.message).to.be.equals('País deve ter um nome.');
	});

	it ('13. teste de create nome null', async () => {
		let ret = await testManager.hub.send(testManager, "db.pais.create", {
			success: {nome: null, sigla: "NO"},
			error: null
		}).promise;

		expect(ret.data.success).to.be.equals(null);
		expect(ret.data.error.errors.nome.message).to.be.equals('País deve ter um nome.');
	});

	it ('14. teste de create nome undefined', async () => {
		let ret = await testManager.hub.send(testManager, "db.pais.create", {
			success: {nome: undefined, sigla: "NO"},
			error: null
		}).promise;

		expect(ret.data.success).to.be.equals(null);
		expect(ret.data.error.errors.nome.message).to.be.equals('País deve ter um nome.');
	});

	it ('15. teste de create sem nome', async () => {
		let ret = await testManager.hub.send(testManager, "db.pais.create", {
			success: {nome: "NO"},
			error: null
		}).promise;

		expect(ret.data.success).to.be.equals(null);
		expect(ret.data.error.errors.sigla.message).to.be.equals('País deve ter uma sigla.');
	});

	it ('16. teste de create nome \'\'', async () => {
		let ret = await testManager.hub.send(testManager, "db.pais.create", {
			success: {sigla: '', nome: "NO"},
			error: null
		}).promise;

		expect(ret.data.success).to.be.equals(null);
		expect(ret.data.error.errors.sigla.message).to.be.equals('País deve ter uma sigla.');
	});

	it ('17. teste de create nome null', async () => {
		let ret = await testManager.hub.send(testManager, "db.pais.create", {
			success: {sigla: null, nome: "NO"},
			error: null
		}).promise;

		expect(ret.data.success).to.be.equals(null);
		expect(ret.data.error.errors.sigla.message).to.be.equals('País deve ter uma sigla.');
	});

	it ('18. teste de create nome undefined', async () => {
		let ret = await testManager.hub.send(testManager, "db.pais.create", {
			success: {sigla: undefined, nome: "NO"},
			error: null
		}).promise;

		expect(ret.data.success).to.be.equals(null);
		expect(ret.data.error.errors.sigla.message).to.be.equals('País deve ter uma sigla.');
	});
});

