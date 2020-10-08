'use strict';
class Response {
  constructor() {
    this._message = '';
    this._data = {};
    this._status = 'success';
  }

  set message(newName) {
    this._message = newName;
  }

  set data(data) {
    this._data = data;
  }

  set status(status) {
    this._status = status;
  }

  get message() {
    return this._message;
  }

  get data() {
    return this._data;
  }

  get status() {
    return this._status;
  }

  get getProperties() {
    return {
      data: this._data,
      message: this._message,
      status: this._status
    };
  }
}

module.exports = Response;
