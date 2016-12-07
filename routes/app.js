var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController')

//Rendering index view.
router.get('/', function (req, res, next) {
    res.render('index');
});
// router.use('/',function (req,res,next) {
//
//     }
// );
//User routes.
function isAuthenticated(role) {

}
router.route('admin/user')
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
    });
router.route('/user:id')
    .get(function (req,res) {
        var userId = req.param.id;
        userController.getUserById(userId,res);
    });
router.route('/user/login')
    .post(function (req,res) {
        userController.login(req,res);
    });
module.exports = router;
