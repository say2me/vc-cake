var merge = require('lodash').merge;
// Inner modules
var enVars = require('./config/settings').env;
var services = require('./lib/services');
var events = require('./lib/events');
var scopes = require('./lib/scopes');
var ModuleAPI = require('./api/module-constructor');

var start = false;
/**
 * @constructor
 */
var App = function() {
};

App.prototype.add = function(scope, fn) {
  scopes.add(scope, fn, new ModuleAPI(scope));
  return this;
};
App.prototype.getService = function(name) {
  return services.get(name);
};
App.prototype.addService = function(name, obj) {
  services.add(name, obj);
  return this;
};
App.prototype.env = function(key, value) {
  if (key && value) {
    enVars.set(key, value);
    return this;
  } else if (key) {
    return enVars.get(key);
  }
};
App.prototype.start = function(fn) {
  if (!start) {
    if ('function' === typeof fn) {
      fn();
    }
    scopes.load();
    events.publish('app', 'event', 'start', true);
    start = true;
  }
};
App.prototype.end = function() {
  scopes.clear();
  services.clear();
  start = false;
  events.request('end');
};
App.prototype.state = function() {
  return start ? 'running' : 'stopped';
};
App.prototype.remove = function(name) {
  scopes.remove(name);
};
module.exports = new App();

