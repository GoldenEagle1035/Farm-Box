var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var Investor = require('../models/investor_model');
var config = require('../config/database');
var bcrypt = require('bcryptjs');

module.exports = function(passport){
     // Local Strategy
    passport.use('investorLocal',new LocalStrategy(function(username, password, done){
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

    // facebook stategy
    passport.use('investorSignin',new FacebookStrategy({
      clientID: config.appID,
      clientSecret: config.appSecret,
      callbackURL: config.url,
      profileFields: ['id', 'emails', 'name','displayName']
    },
      function(token,refreshToken,profile,done){
        console.log(profile);
        process.nextTick(function(){
          Investor.findOne({'id' : profile.id},function(err, investor){
            if(err){
              return done(err);
            }
            if(investor){
              return done(null, investor);
            }else {
              var newInvestor = new Investor();
              newInvestor.userId  = profile.id; 
              newInvestor.token = token;
              newInvestor.firstname = profile.name.givenName;
              newInvestor.lastname = profile.name.familyName; 
              newInvestor.email = profile.emails[0].value;     
              newInvestor.name = profile.displayName; 
              newInvestor.save(function(err){
                if(err) throw err;
                return done(null,investor);
              });
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
