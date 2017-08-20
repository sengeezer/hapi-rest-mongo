'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');

const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 3000
});

server.app.db = mongojs('hapi-rest-mongo', ['globals']);

server.register([
  require('./routes/globals')
], (err) => {
  if (err) {
    throw err;
  }

  server.start((err) => {
    console.log(`Server running at ${server.info.uri}`);
  });
});
