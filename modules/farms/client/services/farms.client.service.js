'use strict';

//Farms service used for communicating with the farms REST endpoints
angular.module('farms').factory('Farms', ['$resource',
  function ($resource) {
    return $resource('api/farms/:farmId', {
      farmId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
