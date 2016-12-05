/**
 * Created by HoangTruongLe on 12/5/2016.
 */
var User = require('../models/user');
module.exports = {
    getAllUser: function (req, res) {
        User.find().then(function (users) {
                res.status(200).json(users);
            })
            .catch(function (err) {
                res.send('Error occured:' + err);
            })
    },
    createUser: function (req, res) {
        var user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            username: req.body.username
        });
        user.save().then(function (users) {
                res.status(200).json(users);
            })
            .catch(function (err) {
                res.send('Error occured:' + err);
            });
    },
    updateUser: function (req, res) {

    },
    deleteUser: function (req, res) {

    }
};