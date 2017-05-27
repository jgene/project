'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
var server = app.start();
var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server);
server.listen(81);

io.on('connection', function (socket) {
    console.log('server Connected');
});
