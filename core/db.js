/**
 * Created by HoangTruongLe on 12/5/2016.
 */
var mongoose = require('mongoose');
var setting  = require('../setting');
var connectStr = 'mongodb://' + setting.dbconfig.user+':'+ setting.dbconfig.password+'@ds119768.mlab.com:19768/'+setting.dbconfig.db;
mongoose.connect(connectStr);
