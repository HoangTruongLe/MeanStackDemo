/**
 * Created by HoangTruongLe on 12/5/2016.
 */
exports.dbconfig = {
    user : "onlineshopping",
    password : "123456",
    db : "onlineshopping",
    pool : {
        max:5,
        min:1,
        idle:100
    },
    host: "localhost",
    port : 3000
};
exports.appSetting = {
    secretKey:'suppersecret'
}
exports.facebook = {
    clientID: '1885443228408624',
    clientSecret: 'dce244a25a2103e3ea1280e0e7fa98bb',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
}