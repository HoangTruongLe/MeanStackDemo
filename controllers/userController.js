/**
 * Created by HoangTruongLe on 12/5/2016.
 */
var User = require('../models/user');
var jwt =require('jsonwebtoken');
var bcrypt = require('bcrypt');
var secretKey = 'supperSecret';
module.exports = {
    getAllUser: function (req, res) {
        User.find().then(function (users) {
            res.status(200).json(users);
        })
            .catch(function (err) {
                res.status(500).json({'Error': err});
            });
    },
    getUserById: function (id, res) {
        User.findOne({'_id': id}).then(function (result) {
            res.status(200).json(result);
        })
            .catch(function (err) {
                res.status(500).json({'Error': err});
            });
    },
    createUser: function (req, res) {
        var user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password,10),
            username: req.body.username
        });
        user.save().then(function (result) {
            res.status(200).json(result);
        })
            .catch(function (err) {
                res.status(500).json({'Error': err});
            });
    },
    updateUser: function (req, res) {
        var user = new {
            firstName: '123123',
            lastName: '123',
            email: 'test',
            password: 'test1212331231131',
            username: '123'
        };
        console.log(user);
        console.log(User);
        User.update({'email': user.email}, user)
            .then(function (result) {
                res.status(200).json(result);
            })
            .catch(function (err) {
                res.status(500).json({'Error': err});
            });
    },
    deleteUser: function (req, res) {
        var user = {
            email:req.body.email,
            password:req.body.password
        };
        User.findOne({'email': user.email, 'password': user.password})
            .then(function (result) {
                if (!result)return res.status(401).json({'Error': 'Unauthenticated'});
                User.remove({'_id': result._id})
                    .then(function (result) {
                        res.status(200).json(result);
                    })
                    .catch(function (err) {
                        res.status(500).json({'Error': err});
                    });
            })
            .catch(function (err) {
                res.status(500).json({'Error': err});
            });
    },
    login:function (req,res) {
        var user = {
            email: 'e',//req.body.email,
            password: 'test'//req.body.password
        };
        User.findOne({'email': user.email})
            .then(function (result) {
                if (!result)return res.status(401).json({'Error': 'Unauthenticated'});
                bcrypt.compare(user.password, result.password, function(err, res) {
                    if(err) return res.status(401).json({'Error': 'Unauthenticated'});
                    //creating token if user is authenticated.
                    var token = jwt.sign(user,secretKey,{ expiresIn: '2h' })
                    res.status(200).json({
                        'Message': 'Authenticated!',
                        'Token': token,
                        'UserId': result._id
                    });
                });

            })
            .catch(function (err) {
                res.status(500).json({'Error': err});
            });
    }
}