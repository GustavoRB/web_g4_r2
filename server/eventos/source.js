const Hub = require("./hub");
const uuid = require("node-uuid").v4;

class Source {
  constructor() {
    this.id = uuid();
    this.hub = Hub;
  }

  set id(uuid) {
    this._id = uuid;
  }

  get id() {
    return this._id;
  }

  set hub(hub) {
    this._hub = hub;
  }

  get hub() {
    return this._hub;
  }

  /**
   * Call this method everytime, to avoid leak on the HUB. if you like
   * to override this,
   * call super.destroy after your code.
   */
  destroy() {
    this.hub.send(this, "hub.core.source.destroyed", {
      error: null,
      success: this.id,
    });
    this.id = null;
  }
}

module.exports = Source;