'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    hat = require('hat'),
  Schema = mongoose.Schema;

/**
 * Farm Schema
 */
var FarmSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
    apikey: {
        type: String,
        default: hat()
    }
});

mongoose.model('Farm', FarmSchema);
