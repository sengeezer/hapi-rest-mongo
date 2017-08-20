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

  server.route({
    method: 'POST',
    path: '/globals'
    handler: (req, res) => {
      const global = req.payload;

      book._id = uuid.v1();

      db.globals.save(global, (err, result) => {
        if (err) {
          return res(Boom.wrap(err, 'Internal MongoDB Error'));
        }

        res(global);
      });
    },
    config: {
      validate: {
        payload: {
          name: Joi.string().min(2).max(50).required(),
          value: Joi.string().min(1).max(50),
          category: Joi.string().min(4).max(50).required(),
          author: Joi.string().min(3).max(50).required(),
          rank: Joi.number()
        }
      }
    }
  });

  server.route({
    method: 'PATCH',
    path: '/globals/{id}',
    handler: (req, res) => {
      db.globals.update({
        _id: req.params.id
      }, {
        $set: req.payload
      }, (err, res) => {
        if (err) {
          return res(Boom.wrap(err, 'Internal MongoDB Error'));
        }

        if(res.n === 0) {
          return res(Boom.notFound());
        }

        res().code(204);
      });
    },
    config: {
      validate: {
        payload: Joi.object({
          name: Joi.string().min(2).max(50).optional(),
          value: Joi.string().min(1).max(50).optional(),
          category: Joi.string().min(4).max(50).optional(),
          author: Joi.string().min(3).max(50).optional(),
          rank: Joi.number().optional()
        }).required().min(1)
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'routes-globals'
};
