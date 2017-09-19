'use strict';

const chai = require('chai');
const TestManager = require('../TestManager');

let expect = chai.expect;

let testManager = null;
let estabelecimento = null;

describe('Teste de manager tipo_comida', () => {
	before(function(done) {
		testManager = new TestManager(done);
	});

	after(async () => {
		await testManager.destroy();
	});

	it('1. teste de create', async () => {
		let estabelecimento_create = {
			endereco: {
				endereco: "58d6a77055d3b9270044469c",
				numero: 55
			},
			cnpj: "cnpj",
			nomefantasia: "nome fantasia",
			razaosocial: "razao",
		};

		let ret = await testManager.hub.send(testManager, "db.estabelecimento.create", {
			success: estabelecimento_create,
			error: null
		}).promise;

		estabelecimento = ret.data.success[0];
		expect(ret.data.success.length).to.be.equals(1);
		expect(estabelecimento_create.cnpj).to.be.equals(estabelecimento.cnpj);
		expect(estabelecimento_create.coordenada).to.be.equals(estabelecimento.coordenada);
		expect(estabelecimento_create.razaosocial).to.be.equals(estabelecimento.razaosocial);
		expect(estabelecimento_create.nomefantasia).to.be.equals(estabelecimento.nomefantasia);
		expect(estabelecimento_create.endereco.numero).to.be.equals(estabelecimento.endereco.numero);
		expect(estabelecimento_create.endereco.endereco).to.be.equals(estabelecimento.endereco.endereco);
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

