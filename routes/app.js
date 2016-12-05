var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController')

router.get('/', function (req, res, next) {
    res.render('index');
});
router.route('/test')
    .get(function (req,res) {
        userController.getAllUser(req,res);
    })
    .post(function (req,res) {
        userController.createUser(req,res);
    })
    .put(function (req,res) {
        userController.updateUser(req,res);
    })
    .delete(function (req,res) {
        userController.deleteUser(req,res);
    })
module.exports = router;
