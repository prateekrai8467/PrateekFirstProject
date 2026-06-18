/* src/utils/eventEmitter.js */
const EventEmitter = require('events');

class AppEventEmitter extends EventEmitter {}

// Instantiate a single shared event emitter for the application
const eventEmitter = new AppEventEmitter();

module.exports = eventEmitter;
