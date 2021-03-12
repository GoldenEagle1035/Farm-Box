var LocalStrategy = require('passport-local').Strategy;
var Investor = require('../models/investor_model');
var Farmer = require('../models/farmer_model');
var config = require('./database');
var bcrypt = require('bcryptjs');

module.exports = function(passport){
    // Local Strategy
    passport.use(new LocalStrategy(function(username, password, done){
      // Match Username
      var query = {username:username};
      Investor.findOne(query, function(err, investor){
          if(err){
            throw err;
          }
          if(!investor){
            return done(null, false, {message: 'No user found'});
          }
          // Match Password
          bcrypt.compare(password, investor.password, function(err, isMatch){
            if(err){
              throw err;  
            }
            if(isMatch){
                return done(null, investor);
            }else {
                return done(null, false, {message: 'Wrong password'});
            }
          });
      });
    }));

    passport.serializeUser(function(investor, done) {
      done(null, investor.id);
    });

    passport.deserializeUser(function(id, done) {
      Investor.findById(id, function(err, investor) {
          done(err, investor);
      });
    });
};