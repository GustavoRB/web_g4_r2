const chai = require('chai');
const fs = require('fs');
const hanler = require('../../handlers/admin_handler');
const path = require('path');

let should = chai.should();
let expect = chai.expect;

describe('Teste de conversao de xlsx pra json', () => {

  let handler = null;

  before(function (done) {
    handler = new hanler();
    done();
  });

  it('1 => conversao da planilha alimentares ', (done) => {

    fs.readFile('C:/projetos/Custo_de_vida_2.0.1/test/fixtures/PlanilhasExportacao/IPC-Fpolis-2017-03-alimentares .xlsx', async (err, data) => {

      if (err) {
        return console.log('deu ruim', err);
      }

      let doc = {
        file_name: 'IPC-Fpolis-2017-03-alimentares .xlsx',
        file_buffer: data,
      };

      await handler.read_xls_from_client(doc);
      done();
    });
  });

});