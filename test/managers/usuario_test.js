'use strict';

const chai = require('chai');
const TestManager = require('../TestManager');

let expect = chai.expect;

let testManager = null;
let usuario = null;

describe('Teste de manager usuario', () => {
	before(function(done) {
		testManager = new TestManager(done);
	});

	after(async () => {
		await testManager.destroy();
	});

	it('01. teste de create', async () => {
		let user = {
			nome: 'Osvaldo',
			login: "batata",
			senha: 'batata',
			numerocelular: '48999476823',
			foto: 'fazendo biquinho',
			idioma: '58d6a77055d3b9270044469c',
			estabelecimentos: ['58e10f536b571001a40128ee'],
		};

		let ret = await testManager.hub.send(testManager, "db.gerente.create", {
			success: user,
			error: null
		}).promise;

		usuario = ret.data.success[0];

		expect(ret.data.success.length).to.be.equals(1);
	});

	it('02. teste de read', async () => {
		let ret = await testManager.hub.send(testManager, "db.gerente.read", {
			success: { _id: usuario.id, populate: 'estabelecimentos' },
			error: null
		}).promise;

		let usuario_read = ret.data.success;
		expect(usuario_read.length).to.be.equals(1);
		expect(ret.data.error).to.be.equals(null);
	});

	// it ('03. teste de update', async () => {
	// 	usuario.nome = "Novo nome";
  //
	// 	await testManager.hub.send(testManager, "db.usuario.update", {
	// 		success: {
	// 			query: { _id: usuario.id },
	// 			update: { nome:  usuario.nome}
	// 		},
	// 		error: null
	// 	}).promise;
  //
	// 	let ret = await testManager.hub.send(testManager, "db.usuario.read", {
	// 		success: {_id: usuario.id},
	// 		error: null
	// 	}).promise;
  //
	// 	let usuario_read = ret.data.success;
	// 	expect(usuario_read.length).to.be.equals(1);
	// 	expect(ret.data.error).to.be.equals(null);
	// });

	it ('21. teste de login ok', async () => {
		let ret = await testManager.hub.send(testManager, "db.gerente.login", {
			success: {login: usuario.login, senha: "batata"},
			error: null
		}).promise;

		let usuario_login = ret.data.success;
		console.log(usuario_login);
	});

	// it ('22. teste de login email errado', async () => {
	// 	let ret = await testManager.hub.send(testManager, "db.usuario.login", {
	// 		success: {email: '', senha: '123456'},
	// 		error: null
	// 	}).promise;
  //
	// 	expect(ret.data.error).to.be.equals(testManager.messages.usuario.login.EMAIL_NOT_FOUND);
	// 	expect(ret.data.success).to.be.equals(null);
	// });
  //
  //
	// it ('23. teste de senha errada', async () => {
	// 	let ret = await testManager.hub.send(testManager, "db.usuario.login", {
	// 		success: {email: usuario.email, senha: ''},
	// 		error: null
	// 	}).promise;
  //
	// 	expect(ret.data.error).to.be.equals(testManager.messages.usuario.login.PASSWORD_MATCH_FAILED);
	// 	expect(ret.data.success).to.be.equals(null);
	// });
  //
	// it ('21. teste de email duplicado', async () => {
	// 	let user = {
	// 		nome: 'Osvaldo',
	// 		sobrenome: 'Miguel',
	// 		email: 'osvaldo.miguel1@grad.ufsc.br',
	// 		senha: '123456',
	// 		datanascimento: new Date(),
	// 		sexo: 'homenzinho',
	// 		numerocelular: '48999476823',
	// 		foto: 'fazendo biquinho',
	// 		idioma: '58d6a77055d3b9270044469c',
	// 	};
  //
	// 	let ret = await testManager.hub.send(testManager, "db.usuario.create", {
	// 		success: user,
	// 		error: null
	// 	}).promise;
  //
	// 	expect(ret.data.success).to.be.equals(null);
	// 	expect(ret.data.error.message).to.be.equals('Email já cadastrado.');
	// });

	// it ('04. teste de delete', async () => {
	// 	await testManager.hub.send(testManager, "db.usuario.delete", {
	// 		success: { _id: usuario.id },
	// 		error: null
	// 	}).promise;
	//
	// 	let ret = await testManager.hub.send(testManager, "db.usuario.read", {
	// 		success: { _id: usuario.id },
	// 		error: null
	// 	}).promise;
	//
	// 	let usuario_read = ret.data.success;
	// 	expect(usuario_read.length).to.be.equals(0);
	// 	expect(ret.data.error).to.be.equals(null);
	// });
});