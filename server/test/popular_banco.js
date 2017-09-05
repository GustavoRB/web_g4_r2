const path = require('path');
const chai = require('chai');
const chaihttp = require('chai-http');
const TestManager = require('./TestManager');
const fs = require('fs');
const BBPromise = require('bluebird');

chai.use(chaihttp);

let testManager = null;

describe('Teste de manager país', () => {
    before(function (done) {
        testManager = new TestManager(done);
    });

    after(async function () {
        await testManager.destroy();
    });

    it('1. popula banco', async () => {
        console.log(path.resolve(__dirname + '/fixtures'));
        let files = fs.readdirSync(path.resolve(__dirname + '/fixtures'));
        let promises = [];
        console.log("\n");
        while (files.length > 0) {
            let file_name = files.shift();
            if (file_name !== 'PlanilhasExportacao') {
                let file = require('./fixtures/' + file_name);

                let text = file.model + ":";
                for (let i = 0; i < file.data.length; i++) {
                    text += ", " + file.data[i]._id;
                }

                console.log(text + "\n");

                promises.push(testManager.hub.send(testManager, "db." + file.model + ".create", {
                    success: file.data,
                    error: null
                }).promise);
            }
        }
        try {
            await BBPromise.all(promises);
        } catch (e) {
            console.error(e);
        }
    });
});