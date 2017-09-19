'use strict';

const chai = require('chai');
const TestManager = require('../TestManager');

let expect = chai.expect;

let testManager = null;
let endereco = null;

describe('Teste de manager tipo_comida', () => {
	before(function(done) {
		testManager = new TestManager(done);
	});

	after(async () => {
		await testManager.destroy();
	});

	it('1. teste de create', async () => {
		let endereco1 = {
			cidade: "58d6a77055d3b9270044469c",
			logradouro: "beiramar",
			cep: "88062450",
			coordenadas: [-48.544901, -27.584372] // lng, lat
		};

		let endereco2 = {
			cidade: "58d6a77055d3b9270044469c",
			logradouro: "iguatemi",
			cep: "88062450",
			coordenadas: [-48.514650, -27.590843] // lng, lat
		};

		let endereco3 = {
			cidade: "58d6a77055d3b9270044469c",
			logradouro: "nois",
			cep: "88062450",
			coordenadas: [-48.502482, -27.585956] // lng, lat
		};

		let palhoca = {
			cidade: "58d6a77055d3b9270044469c",
			logradouro: "palhoca",
			cep: "88062450",
			coordenadas: [-49.464822, -27.602883] // lng, lat
		};

		let e2600 = {
			cidade: "58d6a77055d3b9270044469c",
			logradouro: "2600",
			cep: "88062450",
			coordenadas: [-48.526819, -27.595570] // lng, lat
		};

		let e2400 = {
			cidade: "58d6a77055d3b9270044469c",
			logradouro: "2400",
			cep: "88062450",
			coordenadas: [-48.525092, -27.594980] // lng, lat
		};

		let ret = await testManager.hub.send(testManager, "db.endereco.create", {
			success: [endereco1, endereco2, endereco3, palhoca, e2600, e2400],
			error: null
		}).promise;

		console.log(ret);

		ret = await testManager.hub.send(testManager, 'db.endereco.findByLocation', {
			success: {
				coord: [-48.502482, -27.585956]
			},
			error: null
		}).promise;

		console.log(ret.data.success);
	});
});