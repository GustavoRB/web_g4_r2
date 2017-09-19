const Source = require('../eventos/source');
const App = require('../aplicacao');

class TestManager extends Source {
	constructor(callback) {
		super();

		this.messages = require('../util/messages.json');

		this.hub.on('app.ready', () => {
			callback();
		});

		this.app = new App('./test/config.json');
	}

	async destroy() {
		return await this.app.destroy();
	}
}

module.exports = TestManager;