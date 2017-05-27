'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Farm = mongoose.model('Farm'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, farm;

/**
 * Farm routes tests
 */
describe('Farm CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new farm
    user.save(function () {
      farm = {
        title: 'Farm Title',
        content: 'Farm Content'
      };

      done();
    });
  });

  it('should be able to save an farm if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new farm
        agent.post('/api/farms')
          .send(farm)
          .expect(200)
          .end(function (farmSaveErr, farmSaveRes) {
            // Handle farm save error
            if (farmSaveErr) {
              return done(farmSaveErr);
            }

            // Get a list of farms
            agent.get('/api/farms')
              .end(function (farmsGetErr, farmsGetRes) {
                // Handle farm save error
                if (farmsGetErr) {
                  return done(farmsGetErr);
                }

                // Get farms list
                var farms = farmsGetRes.body;

                // Set assertions
                (farms[0].user._id).should.equal(userId);
                (farms[0].title).should.match('Farm Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an farm if not logged in', function (done) {
    agent.post('/api/farms')
      .send(farm)
      .expect(403)
      .end(function (farmSaveErr, farmSaveRes) {
        // Call the assertion callback
        done(farmSaveErr);
      });
  });

  it('should not be able to save an farm if no title is provided', function (done) {
    // Invalidate title field
    farm.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new farm
        agent.post('/api/farms')
          .send(farm)
          .expect(400)
          .end(function (farmSaveErr, farmSaveRes) {
            // Set message assertion
            (farmSaveRes.body.message).should.match('Title cannot be blank');

            // Handle farm save error
            done(farmSaveErr);
          });
      });
  });

  it('should be able to update an farm if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new farm
        agent.post('/api/farms')
          .send(farm)
          .expect(200)
          .end(function (farmSaveErr, farmSaveRes) {
            // Handle farm save error
            if (farmSaveErr) {
              return done(farmSaveErr);
            }

            // Update farm title
            farm.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing farm
            agent.put('/api/farms/' + farmSaveRes.body._id)
              .send(farm)
              .expect(200)
              .end(function (farmUpdateErr, farmUpdateRes) {
                // Handle farm update error
                if (farmUpdateErr) {
                  return done(farmUpdateErr);
                }

                // Set assertions
                (farmUpdateRes.body._id).should.equal(farmSaveRes.body._id);
                (farmUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of farms if not signed in', function (done) {
    // Create new farm model instance
    var farmObj = new Farm(farm);

    // Save the farm
    farmObj.save(function () {
      // Request farms
      request(app).get('/api/farms')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single farm if not signed in', function (done) {
    // Create new farm model instance
    var farmObj = new Farm(farm);

    // Save the farm
    farmObj.save(function () {
      request(app).get('/api/farms/' + farmObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', farm.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single farm with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/farms/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Farm is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single farm which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent farm
    request(app).get('/api/farms/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No farm with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an farm if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new farm
        agent.post('/api/farms')
          .send(farm)
          .expect(200)
          .end(function (farmSaveErr, farmSaveRes) {
            // Handle farm save error
            if (farmSaveErr) {
              return done(farmSaveErr);
            }

            // Delete an existing farm
            agent.delete('/api/farms/' + farmSaveRes.body._id)
              .send(farm)
              .expect(200)
              .end(function (farmDeleteErr, farmDeleteRes) {
                // Handle farm error error
                if (farmDeleteErr) {
                  return done(farmDeleteErr);
                }

                // Set assertions
                (farmDeleteRes.body._id).should.equal(farmSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an farm if not signed in', function (done) {
    // Set farm user
    farm.user = user;

    // Create new farm model instance
    var farmObj = new Farm(farm);

    // Save the farm
    farmObj.save(function () {
      // Try deleting farm
      request(app).delete('/api/farms/' + farmObj._id)
        .expect(403)
        .end(function (farmDeleteErr, farmDeleteRes) {
          // Set message assertion
          (farmDeleteRes.body.message).should.match('User is not authorized');

          // Handle farm error error
          done(farmDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Farm.remove().exec(done);
    });
  });
});
