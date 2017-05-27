'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Socket'
,  function ($scope, Authentication, Socket) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
      var socket = io.connect('http://localhost:81');
        socket.on('New Update',function(data){
            console.log('Update Occured');
        });
  }
]);
