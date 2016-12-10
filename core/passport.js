/**
 * Created by HoangTruongLe on 12/8/2016.
 */

const JwtStrategy = require('passport-jwt').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const setting = require('../setting');
const User = require('../models/user');
var jwt = require('jsonwebtoken');


// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        secretOrKey: setting.appSetting.secretKey
    };
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.findOne({id: jwt_payload.id}, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));

    passport.use(new FacebookStrategy({
            clientID: setting.facebook.clientID,
            clientSecret: setting.facebook.clientSecret,
            callbackURL: setting.facebook.callbackURL,
            profileFields: ['id', 'email', 'gender', 'name']
        },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({'facebook.id': profile.id}, function (err, user) {
                    if (err) {
                        return done(err, false);
                    }
                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser = new User();
                        console.log(profile);
                        newUser.firstName = profile.first_name;
                        newUser.lastName = profile.last_name;
                        newUser.email = profile.email;
                        newUser.facebook.token = accessToken;
                        newUser.facebook.id = profile.id;
                        newUser.save(function (err) {
                            if (err) return done(err, false);
                            return done(null, newUser);

                        });
                    }
                });
            });

        }
    ));
};
