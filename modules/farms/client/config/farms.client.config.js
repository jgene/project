'use strict';

// Configuring the Farms module
angular.module('farms').run(['Menus',
  function (Menus) {
    // Add the farms dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Farms',
      state: 'farms',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'farms', {
      title: 'List Farms',
      state: 'farms.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'farms', {
      title: 'Create Farms',
      state: 'farms.create'
    });
  }
]);
