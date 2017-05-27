'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Farm = mongoose.model('Farm'),
    Sensor = mongoose.model('Sensor'),
    app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),

  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a farm
 */
exports.create = function (req, res) {
  var farm = new Farm(req.body);
  farm.user = req.user;

  farm.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
        io.on('connection', function (socket) {
    console.log('upadated');
        });
      res.json(farm);
    }
  });
};

/**
 * Show the current farm
 */
exports.read = function (req, res) {
  res.json(req.farm);
};

/**
 * Update a farm
 */
exports.update = function (req, res) {
  var farm = req.farm;

  farm.title = req.body.title;
  farm.content = req.body.content;
  farm.content12 = req.body.content12;
  farm.content21 = req.body.content21;
  farm.content22 = req.body.content22;
  farm.content31 = req.body.content31;
  farm.content32 = req.body.content32;
  farm.content41 = req.body.content41;
  farm.content42 = req.body.content42;

  farm.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
        //socket.emit('Update');
      res.json(farm);
    }
  });
};

exports.sensorData = function (req, res) {
    var sensor = req.sensor;

    sensor.title = req.body.title;
    sensor.content = req.body.content;
    sensor.content12 = req.body.content12;
    sensor.content21 = req.body.content21;
    sensor.content22 = req.body.content22;
    sensor.content31 = req.body.content31;
    sensor.content32 = req.body.content32;
    sensor.content41 = req.body.content41;
    sensor.content42 = req.body.content42;

    sensor.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(sensor);
        }
    });
};

/**
 * Delete an farm
 */
exports.delete = function (req, res) {
  var farm = req.farm;

  farm.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(farm);
    }
  });
};

/**
 * List of Farms
 */
exports.list = function (req, res) {
  Farm.find().sort('-created').populate('user', 'displayName').exec(function (err, farms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(farms);
    }
  });
};

/**
 * Farm middleware
 */
exports.farmByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Farm is invalid'
    });
  }

  Farm.findById(id).populate('user', 'displayName').exec(function (err, farm) {
    if (err) {
      return next(err);
    } else if (!farm) {
      return res.status(404).send({
        message: 'No farm with that identifier has been found'
      });
    }
    req.farm = farm;
    next();
  });
};
