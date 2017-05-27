'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Sensor Schema
 */
var SensorSchema = new Schema({
    created: {
        type: Date,
        default: ''
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    content12: {
        type: Number,
        default: '',
        trim: true
    },
    content21: {
        type: String,
        default: '',
        trim: true
    },
    content22: {
        type: Number,
        default: '',
        trim: true
    },
    content31: {
        type: String,
        default: '',
        trim: true
    },
    content32: {
        type: Number,
        default: '',
        trim: true
    },
    content41: {
        type: String,
        default: '',
        trim: true
    },
    content42: {
        type: Number,
        default: '',
        trim: true
    },
    apikey: {
        type: String,
        default: ''
    }
});

mongoose.model('Sensor', SensorSchema);
