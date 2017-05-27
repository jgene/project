'use strict';

// Setting up route
angular.module('farms').config(['$stateProvider',
  function ($stateProvider) {
    // Farms state routing
    $stateProvider
      .state('farms', {
        abstract: true,
        url: '/farms',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('farms.list', {
        url: '',
        templateUrl: 'modules/farms/views/list-farms.client.view.html'
      })
      .state('farms.create', {
        url: '/create',
        templateUrl: 'modules/farms/views/create-farm.client.view.html'
      })
      .state('farms.view', {
        url: '/:farmId',
        templateUrl: 'modules/farms/views/view-farm.client.view.html'
      })
      .state('farms.edit', {
        url: '/:farmId/edit',
        templateUrl: 'modules/farms/views/edit-farm.client.view.html'
      });
  }
]);
