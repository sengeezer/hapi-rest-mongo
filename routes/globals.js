'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = (server, options, next) => {
  const db = server.app.db;
  // definitions
  server.route({
    method: 'GET',
    path: '/globals',
    handler: (req,res) => {
      db.globals.find((err, docs) => {
        if (err) {
          return res(Boom.wrap(err, 'Internal MongoDB Error'));
        }

        res(docs);
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/globals/{id}'
    handler: (req, res) => {
      db.globals.findOne({
        _id: req.params.id
      }, (err, doc) => {
        if (err) {
          return res(Boom.wrap(err, 'Internal MongoDB Error'));
        }

        if (!doc) {
          return res(Boom.notFound());
        }

        res(doc);
      });
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'routes-globals'
};
