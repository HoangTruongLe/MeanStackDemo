//Import dependencies
var express = require('express');
var router = express.Router();
var passport = require('passport');
var setting = require('../setting');
var jwt = require('jsonwebtoken');
//Set up middlewares
var requireAuth = passport.authenticate('jwt', {session: false});

// Initialize passport and passport session
router.use(passport.initialize());
require('../core/passport')(passport);

//Import models
var User = require('../models/user');
var Product = require('../models/product')


//======================= Render index view.==============================
router.get('/', function (req, res) {
    res.render('index');
});

//===================== Router for facebook authentication ========================
router.get('/auth/facebook/', passport.authenticate('facebook', {scope: ['email']}));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {session: false}),function (req,res) {
        const token = jwt.sign({userId: req.user._id}, setting.appSetting.secretKey, {
            expiresIn: '2h'
        });
        res.status(200).json({
            success: true,
            token: 'JWT ' + token
        });
    });
//====================== Handle client requests ==============================
router.route('/user')
    .put(requireAuth, function (req, res) {
        console.log(req.user);
        User.updateUser(req, res);
    })
    .delete(requireAuth, function (req, res) {
        User.deleteUser(req, res);
    });
router.route('/user')
    .post(function (req, res) {
        User.createUser(req, res);
    });
router.route('/user:id')
    .get(requireAuth, function (req, res) {
        User.getUserById(req.param.id, res);
    });
router.route('/login')
    .post(function (req, res) {
        User.login(req, res);
    });
router.route('/product')
    .get(function (req,res) {
        Product.getAllProduct(req,res);
    });
router.get('/product/:id',function (req,res) {
    Product.getProductById(req,res);
});

//===================== Handle admin requests ===========================
router.use('/admin', requireAuth, function (req, res, next) {
    var token = req.headers.authorization.replace('JWT ', '');
    var decoded = jwt.decode(token);
    User.findOne({'_id': decoded.userId}, function (err, user) {
        if (err) return res.status(401).json({'Error': err});
        if (!user) return res.status(401).json({'Error': 'Unauthenticated'});
        console.log(user);
        if (!(user.role === 'admin')) return res.status(401).json({success: false, 'error': 'Access denied!'});
        next();
    });

});

router.route('/admin/user')
    .get(function (req, res) {
        User.getAllUser(req, res);
    });

router.route('/admin/product')
    .post(function (req,res) {
       Product.createProduct(req,res);
    })
    .put(function (req,res) {
       Product.updateProduct(req,res);
    })
    .delete(function (req,res) {
       Product.deleteProduct(req,res);
    });

//============================ Export router ==================================

module.exports = router;
