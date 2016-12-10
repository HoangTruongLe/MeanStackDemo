/**
 * Created by HoangTruongLe on 12/5/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt');
var setting = require('../setting');
var jwt = require('jsonwebtoken');

var userSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String, require: true, unique: true},
    password: {type: String},
    userImage: {
        type:String,
        default:'noimage.png'
    },
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'
    },
    facebook:{
        token:{type:String},
        id:{type:String}
    },
    google:{
        token:{type:String},
        id:{type:String}
    }
});

// Saves the user's password hashed
userSchema.pre('save', function (next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        if(user.password){
            bcrypt.hash(user.password, 10, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        }
        else next();
    } else {
        return next();
    }
});
userSchema.plugin(mongooseUniqueValidator);

// Create method to compare password input to password saved in database
userSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};



userSchema.statics.getAllUser = function (req, res) {
    this.find().then(function (users) {
        res.status(200).json({'Success':true,'Users':users});
    })
        .catch(function (err) {
            res.status(500).json({'Success':false,'Error':err});
        });
};

userSchema.statics.getUserById = function (id, res) {
    this.findOne({'_id': id}).then(function (user) {
        res.status(200).json({'Success':true,'User':user});
    })
        .catch(function (err) {
            res.status(500).json({'Success':false,'Error':err});
        });
};
userSchema.statics.createUser = function (req, res) {
    var user = new this({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        username: req.body.username
    });
    user.save().then(function (user) {
        res.status(200).json({'Success':true,'User':user});
    })
        .catch(function (err) {
            res.status(500).json({'Success':false,'Error':err});
        });
};
userSchema.statics.updateUser = function (req, res) {
    var user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        username: req.body.username
    };
    this.update({'email': user.email}, user)
        .then(function (user) {
            res.status(200).json({'Success':true,'User':user});
        })
        .catch(function (err) {
            res.status(500).json({'Success':false,'Error':err});
        });
};
userSchema.statics.deleteUser = function (req, res) {
    var user = {
        email: req.body.email,
        password: req.body.password
    };
    this.findOneAndRemove({'email': user.email, 'password': user.password},function (err) {
        if(err)return res.status(500).json({'Success':false,'Error':err});
        res.status(200).json({'Success':true,'Result':result});
    });
};
userSchema.statics.login = function (req, res) {
    this.findOne({'email': req.body.email}, function (err, user) {
        console.log(user);
        if (!user) {
            return res.status(401).json({'Success':false,'Error':err});
        }

        user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
                // Create token if the password matched and no error was thrown
                const token = jwt.sign({userId: user._id}, setting.appSetting.secretKey, {
                    expiresIn: '2h'
                });
                res.status(200).json({
                    success: true,
                    token: 'JWT ' + token
                });
            } else {
                res.status(401).json({'Success':false,'Error':err});
            }
        })
    })
};

module.exports = mongoose.model('user', userSchema);

