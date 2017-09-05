"use strict";
class Session {
    constructor(key, userId, rtc) {
        this._rtc = rtc;
        this._key = key;
        this._userId = userId;
    }
    get rtc() {
        return this._rtc;
    }
    get key() {
        return this._key;
    }
    get userId() {
        return this._userId;
    }
}
exports.Session = Session;
