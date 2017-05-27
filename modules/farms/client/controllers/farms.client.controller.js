'use strict';

// Farms controller
angular.module('farms').controller('FarmsController', ['$scope','$interval','$stateParams', '$location', 'Authentication', 'Farms','Socket',
  function ($scope, $interval, $stateParams, $location, Authentication, Farms, Socket) {
    $scope.authentication = Authentication;

      $scope.refresh = function() {
          var serverData = Farms.query();
          setTimeout(function(){
              if (serverData !== $scope.farms){
                  $scope.farms = serverData;
              }
          }, 100);

      };


      $scope.intervalPromise = $interval(function(){
          $scope.refresh();
      }, 10000);

      // initial load of data
      $scope.refresh();

    // Create new Farm
    $scope.create = function () {
      // Create new Farm object
      var farm = new Farms({
        title: this.title,
        content: this.content,
        content12: this.content12,
        content21: this.content21,
        content22: this.content22,
        content31: this.content31,
        content32: this.content32,
        content41: this.content41,
        content42: this.content42
      });

      // Redirect after save
      farm.$save(function (response) {
        $location.path('farms/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
        $scope.content21 = '';
        $scope.content31 = '';
        $scope.content41 = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Farm
    $scope.remove = function (farm) {
      if (farm) {
        farm.$remove();

        for (var i in $scope.farms) {
          if ($scope.farms[i] === farm) {
            $scope.farms.splice(i, 1);
          }
        }
      } else {
        $scope.farm.$remove(function () {
          $location.path('farms');
        });
      }
    };

    // Update existing Farm
    $scope.update = function () {
      var farm = $scope.farm;

      farm.$update(function () {
        $location.path('farms/' + farm._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Farms
    $scope.find = function () {
      $scope.farms = Farms.query();
    };

    // Find existing Farm
    $scope.findOne = function () {
      $scope.farm = Farms.get({
        farmId: $stateParams.farmId
      });
    };
  }
]);
