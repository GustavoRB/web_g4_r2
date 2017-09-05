'use strict';
var fs = require('fs');
const readline = require('readline');
var stats = null;
var hasConfig = false;

console.log(' RUNNING INSTALL FOR Esqueleto2.0 ');

function initconfig(config) {
  const rl = readline.createInterface(
    {input: process.stdin, output: process.stdout}
  );
  rl.question('Qaul o nome do banco? ', (answer) => {
    console.log('O nome do banco escolhido foi:', answer);
    config.db.mongodb.nomedobanco = answer;


    fs.writeFileSync('./config.json', JSON.stringify(config));


    console.log('Para gerar a documentação, use: npm run-script generate-docs ')

    rl.close();
  });
}


try {
  stats = fs.lstatSync('config.json');
  hasConfig = stats.isFile();
} catch (e) {
}

// Se o config.json não existe, cria e copia
// o config.dist.json para config.json
if (!hasConfig) {
  let configdist = require('./config.dist.json');
  initconfig(configdist);
}