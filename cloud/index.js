const initialState = require('./mock/initialState');
const { messages } = require('people-config');
const logger = require('./../logger');

const state = initialState;

function onSync(socket) {
  const event = messages.sync;
  logger.info({ event });

  return socket.emit(messages.sync, state);
}

function emit(message, data) 

function addListenersToSocket(io, socket) {
  socket.on(messages.sync, () => sync(socket));
  socket.on(messages.addContact, (contact) => addContact(io, socket, contact));
  socket.on(messages.editContact, () => editContact(io, socket));
  socket.on(messages.deleteContact, () => deleteContact(io, socket));
}

module.exports.init = (io) => {
  io.on('connection', (socket) => addListenersToSocket(io, socket));
  
}
