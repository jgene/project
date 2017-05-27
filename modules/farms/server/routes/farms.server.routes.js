'use strict';

/**
 * Module dependencies.
 */
var farmsPolicy = require('../policies/farms.server.policy'),
  farms = require('../controllers/farms.server.controller');

module.exports = function (app) {
  // Farms collection routes
  app.route('/api/farms').all(farmsPolicy.isAllowed)
    .get(farms.list)
    .post(farms.create);

  app.route('/api/farms/sensors/:farmId')
      .put(farms.update)
        .post(farms.create);

    // Single farm routes
  app.route('/api/farms/:farmId')
    .get(farms.read)
    .put(farms.update)
    .delete(farms.delete);

  // Finish by binding the farm middleware
  app.param('farmId', farms.farmByID);
};
