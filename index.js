'use strict';

const BBPromise = require('bluebird');

const App = require('./aplicacao');
Promise = BBPromise;
new App('./config.json');