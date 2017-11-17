const initialState = require('./mock/initialState');
const { messages } = require('people-config');
const logger = require('./../logger');

const { contacts } = initialState;
let id = contacts.reduce((result, { id }) => result < id ? id : result, -1);

function emit(socket, type, payload) {
  logger.info({ type });

  return socket.emit(type, payload);
} 

function share(io, type, payload) {
  logger.info({ type, payload });

  return io.emit(type, payload);
}

function sync(socket) {
  return emit(socket, messages.sync, contacts);
}

function addContact(io, contact) {
  contact.id = ++id;
  contacts.push(contact);

  return share(io, messages.addContact, contact);
}

function deleteContact(io, contact) {
  const { id } = contact;
  const index = contacts.findIndex(item => item.id === id);

  contacts.splice(index, 1);

  return share(io, messages.deleteContact, contact);
}

function editContact(io, contact) {
  const { id } = contact;
  const index = contacts.findIndex(item => item.id === id);

  if (index > -1) {
    contacts[index] = contact;
  }
  
  return share(io, messages.editContact, contact);
}

function addListenersToSocket(io, socket) {
  socket.on(messages.sync, () => sync(socket));
  socket.on(messages.addContact, (contact) => addContact(io, contact));
  socket.on(messages.deleteContact, (contact) => deleteContact(io, contact));
  socket.on(messages.editContact, (contact) => editContact(io, contact));
}

module.exports.init = (io) => {
  io.on('connection', (socket) => addListenersToSocket(io, socket));
}
