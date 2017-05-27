'use strict';

(function () {
  // Farms Controller Spec
  describe('Farms Controller Tests', function () {
    // Initialize global variables
    var FarmsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Farms,
      mockFarm;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Farms_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Farms = _Farms_;

      // create mock farm
      mockFarm = new Farms({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Farm about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Farms controller.
      FarmsController = $controller('FarmsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one farm object fetched from XHR', inject(function (Farms) {
      // Create a sample farms array that includes the new farm
      var sampleFarms = [mockFarm];

      // Set GET response
      $httpBackend.expectGET('api/farms').respond(sampleFarms);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.farms).toEqualData(sampleFarms);
    }));

    it('$scope.findOne() should create an array with one farm object fetched from XHR using a farmId URL parameter', inject(function (Farms) {
      // Set the URL parameter
      $stateParams.farmId = mockFarm._id;

      // Set GET response
      $httpBackend.expectGET(/api\/farms\/([0-9a-fA-F]{24})$/).respond(mockFarm);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.farm).toEqualData(mockFarm);
    }));

    describe('$scope.craete()', function () {
      var sampleFarmPostData;

      beforeEach(function () {
        // Create a sample farm object
        sampleFarmPostData = new Farms({
          title: 'An Farm about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Farm about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Farms) {
        // Set POST response
        $httpBackend.expectPOST('api/farms', sampleFarmPostData).respond(mockFarm);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the farm was created
        expect($location.path.calls.mostRecent().args[0]).toBe('farms/' + mockFarm._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/farms', sampleFarmPostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock farm in scope
        scope.farm = mockFarm;
      });

      it('should update a valid farm', inject(function (Farms) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/farms\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/farms/' + mockFarm._id);
      }));

      it('should set scope.error to error response message', inject(function (Farms) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/farms\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(farm)', function () {
      beforeEach(function () {
        // Create new farms array and include the farm
        scope.farms = [mockFarm, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/farms\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockFarm);
      });

      it('should send a DELETE request with a valid farmId and remove the farm from the scope', inject(function (Farms) {
        expect(scope.farms.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.farm = mockFarm;

        $httpBackend.expectDELETE(/api\/farms\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to farms', function () {
        expect($location.path).toHaveBeenCalledWith('farms');
      });
    });
  });
}());
