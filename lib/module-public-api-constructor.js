'use strict';
var _ = require('lodash');

var constants = require('../config/settings').constants;
var events = require('./events');
var scopes = require('./scopes');

var callAction = function(scope, action, props) {
  scopes.callAction(scope, action, props);
};
/**
 * Represent Modules Scope API
 * @constructor
 * @param {string} name Name of the scope to use with this API object.
 * @property {string} name
 * @return {API}
 */
var API;
API = module.exports = function(name) {
  this.name = name;
  Object.defineProperty(this, 'actions', {
    enumerable: false,
    configurable: false,
    /**
     * @this {API} this
     * @returns {Array}
     */
    get: function() {
      return Object.keys(scopes.actions[this.name]);
    }
  });
};
API.prototype.on = function(event, fn, options) {
  var result = this;
  var once = (options && !!options.once || false);
  if ('undefined' === typeof fn) {
    result = {
      do: function() {
        var action = arguments[0];
        var attr = Array.prototype.slice.call(arguments, 1);
        this.subscribe(function() {
          callAction(this.name, action, attr);
        }.bind(this));
      }.bind({
        subscribe: events.subscribe(constants.MODULE_TYPE, this.name, event, _, once),
        name: this.name
      })
    };
  } else if (_.isFunction(fn)) {
    events.subscribe(constants.MODULE_TYPE, this.name, event, fn, once);
  }
  return result;
};
API.prototype.once = function(event, fn) {
  return this.on(event, fn, {once: true});
};
/*
API.prototype.do = function() {
  var action = arguments[0];
  var attr = Array.prototype.slice.call(arguments, 1);
  callAction(this.name, action, attr);
  return this;
};
*/
