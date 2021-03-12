var LocalStrategy = require('passport-local').Strategy;
var Farmer = require('../models/farmer_model');
var config = require('../config/database');
var bcrypt = require('bcryptjs');

module.exports = function(passport){
    // Local Strategy
    passport.use(new LocalStrategy(function(username, password, done){
      // Match Username
      var query = {username:username};
      Farmer.findOne(query, function(err, farmer){
          if(err){
            throw err;
          }
          if(!farmer){
            return done(null, false, {message: 'No user found'});
          }
          // Match Password
          bcrypt.compare(password, farmer.password, function(err, isMatch){
            if(err){
              throw err;  
            }
            if(isMatch){
                return done(null, farmer);
            }else {
                return done(null, false, {message: 'Wrong password'});
            }
          });
      });
    }));

    passport.serializeUser(function(farmer, done) {
      done(null, farmer.id);
    });

    passport.deserializeUser(function(id, done) {
      Farmer.findById(id, function(err, farmer) {
          done(err, farmer);
      });
    });
};