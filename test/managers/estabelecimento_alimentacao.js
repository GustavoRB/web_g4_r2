'use strict';

const chai = require('chai');
const TestManager = require('../TestManager');

let expect = chai.expect;

let testManager = null;

let alimentacao_base = {
	"_id": "58e10f531e5d9a2cde991666",
	"id": "58e10f531e5d9a2cde991666",
	"razaosocial": "fugiat",
	"nomefantasia": "aute",
	"cnpj": "16.107.737/0001-48",
	"endereco": {"endereco": "58d837579cc4a518b0f84fc3","numero": 44},
	"ingredientes": [],
	"tipo_estabelecimento": "Vende batata",
	"fila_pedidos": [],
	"cardapio": [
		{
			"nome": "Comida",
			"categorias": [
				{
					"nome": "",
					"produtos": [
						{"disponivel": true,"produto": "58e02f2eb8fd178ad246de98"},
						{"disponivel": false,"produto": "58e02f2e61db5dfb9febc23c"},
						{"disponivel": true,"produto": "58e02f2ec1e799b6f4352c59"},
						{"disponivel": true,"produto": "58e02f2e0c498bf4df3f5eb7"},
						{"disponivel": false,"produto": "58e02f2eed2528e82bfeb0bf"},
						{"disponivel": false,"produto": "58e02f2e644bea445deb7e2b"},
						{"disponivel": true,"produto": "58e02f2e911ea7c689b3b8ef"}
					]
				}
			]
		},
		{
			"nome": "Bebida",
			"categorias": [
				{
					"nome": "",
					"produtos": [
						{ "disponivel": true, "produto": "58e02f2e1deb998956b2a0e5" },
						{ "disponivel": false, "produto": "58e02f2ea7c34e8ec39e2d44" },
						{ "disponivel": true, "produto": "58e02f2e15688cbc71571ba0" }
					]
				}
			]
		}
	],
	"config": {
		"tipo_comida": [
			"58e00bb0ad7eab1eaba28743",
			"58e00bb0f10f283dd6db4fbd",
			"58e00bb0b75aaff601ae9343"
		],
		"horarios": [
			{"hora_abertura": "14:00","hora_fechamento": "18:00","dia_semana": 1},
			{"hora_abertura": "10:00","hora_fechamento": "20:00","dia_semana": 2},
			{"hora_abertura": "12:00","hora_fechamento": "23:00","dia_semana": 3},
			{"hora_abertura": "14:00","hora_fechamento": "18:00","dia_semana": 4},
			{"hora_abertura": "10:00","hora_fechamento": "20:00","dia_semana": 5},
			{"hora_abertura": "18:00","hora_fechamento": "00:00","dia_semana": 6}
		],
		"tamanho_max_fila": 10,
		"categorias_cardapio": ["Comida","Bebida"],
		"config_produto": ["Obrigatório","Selecionável","Opcional","Adicional"]
	},
  "key": "KEY",
  "token": "TOKEN"
};

describe('Teste de manager tipo_comida', () => {
	before(function(done) {
		testManager = new TestManager(done);
	});

	after(async () => {
		await testManager.destroy();
	});

	it('1. teste de create', async () => {
		let ret = await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.create", {
			success: alimentacao_base,
			error: null
		}).promise;

		expect(ret.data.success.length).to.be.equals(1);
	});

	it ('2. teste de read', async () => {
		let ret = await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.read", {
			success: {
				_id: alimentacao_base.id
			},
			error: null
		}).promise;

		expect(ret.data.success.length).to.be.equals(1);
	});

	it ('3.1.1 teste de adiciona categoria do cardápio', async () => {
		let ret = await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.cardapio.adiciona_categoria", {
			success: {
				estabelecimento: alimentacao_base.id,
				nome: "Batatas",
				tipo_categoria: 0
			},
			error: null
		}).promise;

		expect(ret.data.error).to.be.equals(null);

		ret = await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.read", {
			success: { _id: alimentacao_base.id },
			error: null
		}).promise;

		expect(ret.data.error).to.be.equals(null);
		expect(ret.data.success.length).to.be.equals(1);
		let alimentacao = ret.data.success[0];
		expect(alimentacao.cardapio[0].categorias.length).to.be.equals(2);
		expect(alimentacao.cardapio[0].categorias[0].nome).to.be.equals("");
		expect(alimentacao.cardapio[0].categorias[1].nome).to.be.equals("Batatas");
	});

	it ('3.1.2 teste de reordena categoria do cardápio', async () => {
		await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.cardapio.reordena_categorias", {
			success: {
				estabelecimento: alimentacao_base.id,
				posicoes: [1, 0],
				tipo_categoria: 0
			},
			error: null
		}).promise;
	});

	it ('3.1.3 teste de remove categoria do cardápio', async () => {
		await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.cardapio.remove_categoria", {
			success: {
				estabelecimento: alimentacao_base.id,
				posicao: 0,
				tipo_categoria: 0
			},
			error: null
		}).promise;
	});


	it ('3.1.4 teste de renomeia categoria do cardápio', async () => {
		await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.cardapio.renomeia_categoria", {
			success: {
				estabelecimento: alimentacao_base.id,
				nome: "Novo nome de categoria",
				tipo_categoria: 0,
				posicao: 0
			},
			error: null
		}).promise;
	});

	it ('3.2.1 teste de adicionar produto', async () => {
		await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.cardapio.adiciona_produto", {
			success: {
				estabelecimento: alimentacao_base.id,
				tipo_categoria: 0,
				categoria: 0,
				produto: "58e00bb0ad7eab1eaba28743"
			},
			error: null
		}).promise;
	});

	it ('3.2.2 teste de remover produto', async () => {
		await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.cardapio.remove_produto", {
			success: {
				estabelecimento: alimentacao_base.id,
				categoria: 0,
				tipo_categoria: 0,
				produto: "58e00bb0ad7eab1eaba28743"
			},
			error: null
		}).promise;
	});

	it ('3.2.3 teste de reogarnizar produto', async () => {
		await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.cardapio.reordena_produtos", {
			success: { estabelecimento: alimentacao_base.id, categoria: 1, tipo_categoria: 0, posicoes: [2, 1, 0] },
			error: null
		}).promise;
	});

	it ('3.3.1 teste de adicionar pedido na fila', async () => {
		await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.fila.adiciona", {
			success: {estabelecimento: alimentacao_base.id,pedido: {id: "58ea61abfc7c0e1c44c60a4a",tempo_preparo: 10}},
			error: null
		}).promise;

    await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.fila.adiciona", {
      success: {estabelecimento: alimentacao_base.id,pedido: {id: "58ea61abfc7c0e1c44c60a4b",tempo_preparo: 20}},
      error: null
    }).promise;

    await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.fila.adiciona", {
      success: {estabelecimento: alimentacao_base.id,pedido: {id: "58ea61abfc7c0e1c44c60a4c",tempo_preparo: 30}},
      error: null
    }).promise;

    let res = await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.fila.adiciona", {
      success: {estabelecimento: alimentacao_base.id,pedido: {id: "58ea61abfc7c0e1c44c60a4d",tempo_preparo: 40}},
      error: null
    }).promise;

    let ret = await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.read", {
			success: {
				_id: alimentacao_base.id
			},
			error: null
		}).promise;

		expect(ret.data.success[0].fila_pedidos.elementos.length).to.be.equals(4);
	});

	it ('3.3.2 teste de mover pedido para outra fila', async () => {
		await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.fila.trocar", {
			success: {
				estabelecimento: alimentacao_base.id,
				pedido: "58ea61abfc7c0e1c44c60a4a",
				fila_antiga: "pedidos",
				fila_nova: "cozinha"
			},
			error: null
		}).promise;

    await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.fila.trocar", {
      success: {
        estabelecimento: alimentacao_base.id,
        pedido: "58ea61abfc7c0e1c44c60a4b",
        fila_antiga: "pedidos",
        fila_nova: "cozinha"
      },
      error: null
    }).promise;

    await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.fila.trocar", {
      success: {
        estabelecimento: alimentacao_base.id,
        pedido: "58ea61abfc7c0e1c44c60a4c",
        fila_antiga: "pedidos",
        fila_nova: "cozinha"
      },
      error: null
    }).promise;

    await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.fila.trocar", {
      success: {
        estabelecimento: alimentacao_base.id,
        pedido: "58ea61abfc7c0e1c44c60a4c",
        fila_antiga: "cozinha",
        fila_nova: "preparo"
      },
      error: null
    }).promise;

    await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.fila.trocar", {
      success: {
        estabelecimento: alimentacao_base.id,
        pedido: "58ea61abfc7c0e1c44c60a4b",
        fila_antiga: "cozinha",
        fila_nova: "preparo"
      },
      error: null
    }).promise;

    let res = await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.fila.trocar", {
      success: {
        estabelecimento: alimentacao_base.id,
        pedido: "58ea61abfc7c0e1c44c60a4c",
        fila_antiga: "preparo",
        fila_nova: "entrega"
      },
      error: null
    }).promise;

    let ret = await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.read", {
			success: {
				_id: alimentacao_base.id
			},
			error: null
		}).promise;

		expect(ret.data.success[0].fila_pedidos.elementos.length).to.be.equals(1);
		expect(ret.data.success[0].fila_cozinha.elementos.length).to.be.equals(1);
    expect(ret.data.success[0].fila_preparo.elementos.length).to.be.equals(1);
    expect(ret.data.success[0].fila_entrega.elementos.length).to.be.equals(1);
	});

	// it ('3.3.3 teste de remover pedido na fila', async () => {
	// 	let remove = await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.fila.remove", {
	// 		success: {
	// 			estabelecimento: alimentacao_base.id,
	// 			pedido: "58ea61abfc7c0e1c44c60a4a",
	// 			fila: "cozinha"
	// 		},
	// 		error: null
	// 	}).promise;
  //
	// 	let ret = await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.read", {
	// 		success: {
	// 			_id: alimentacao_base.id
	// 		},
	// 		error: null
	// 	}).promise;
  //
	// 	expect(ret.data.success[0].fila_pedidos.elementos.length).to.be.equals(0);
	// });
	// it ('4. teste de remover alimentacao', async () => {
	// 	await testManager.hub.send(testManager, "db.estabelecimento_alimentacao.delete", {
	// 		success: {
	// 			_id: alimentacao_base.id
	// 		},
	// 		error: null
	// 	}).promise;
	// });
});

