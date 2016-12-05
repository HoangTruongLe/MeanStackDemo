/**
 * Created by HoangTruongLe on 12/5/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    firstName: {type:String},
    lastName: {type:String},
    email: {type:String, require:true,unique:true},
    userName: {type:String, require:true},
    password: {type:String, require:true}

});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('user',schema);