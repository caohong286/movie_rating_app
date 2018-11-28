const User = require('../models/User.js');
const passport = require('passport');
const config = require('./../config/Config');
const Strategy = require('passport-baidu').Strategy;

module.exports.controller = (app) => {
  // baidu strategy
  passport.use(new Strategy({
    clientID: config.BAIDU_APP_ID,
    clientSecret: config.BAIDU_APP_SECRET,
    callbackURL: '/login/baidu/return',
    profileFields: ['id', 'displayName', 'email'],
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(JSON.stringify(profile),"","\t");
    /*
        console.log(JSON.stringify(profile));
{"provider":"baidu","id":"1177045859",
  "username":"jackcaohong286","gender":"1",
  "photos":[{"value":"http://tb.himg.baidu.com/sys/portraitn/item/05466a61636b63616f686f6e67323836bc2c"},
    {"value":"http://tb.himg.baidu.com/sys/portrait/item/05466a61636b63616f686f6e67323836bc2c"}],
  "_raw":"{\"blood\":\"3\",\"education\":\"0\",\"sex\":\"1\",\"trade\":\"0\",\"marriage\":\"2\",\"userid\":\"1177045859\",\"constellation\":\"1\",
  \"username\":\"jackcaohong286\",\"figure\":\"4\",\"job\":\"0\",\"portrait\":\"05466a61636b63616f686f6e67323836bc2c\",
  \"birthday\":\"1982-02-01\",\"is_bind_mobile\":\"1\",\"is_realname\":\"1\"}",
  "_json":{"blood":"3","education":"0","sex":"1","trade":"0","marriage":"2","userid":"1177045859",
  "constellation":"1","username":"jackcaohong286","figure":"4","job":"0",
"portrait":"05466a61636b63616f686f6e67323836bc2c","birthday":"1982-02-01","is_bind_mobile":"1","is_realname":"1"}}
    */
    // const email = profile.emails[0].value;//百度不提供email
    const email = profile.username + "@baidu.com";
    User.getUserByEmail(email, (err, user) => {
      if (!user) {
        const newUser = new User({
          name: profile.username,
          email,
          baiduId: profile.id,
        });
        User.createUser(newUser, (error) => {
          if (error) {
            // Handle error
          }
          return cb(null, user);
        });
      } else {
        return cb(null, user);
      }
      return true;
    });
  }));

  app.get('/login/baidu',
    passport.authenticate('baidu', { scope: ['netdisk'] }));

  app.get('/login/baidu/return',
    passport.authenticate('baidu', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    });
};
