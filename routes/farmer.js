/*jshint esversion: 6 */
var express = require('express');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var router = express.Router(); //Express router is used to creat the api 
var Farmer = require('../models/farmer_model');
var Farm = require('../models/farm_model');

// create farm
router.post('/create/createfarm',(req,res)=>{
  var name = req.body.name;
  var type = req.body.type;
  var price = req.body.price;
  var contractPeriod = req.body.contractPeriod;
  var harvestPeriod = req.body.harvestPeriod;
  var capacity = req.body.capacity;
  var noHarvested = req.body.noHarvested;
  var ret = req.body.return;
  var owner = req.body.owner;

  var newFarm = new Farm({
    name: name,
    type: type,
    price: price,
    contractPeriod: contractPeriod,
    harvestPeriod: harvestPeriod,
    capacity: capacity,
    noHarvested: noHarvested,
    return: ret,
    owner: owner
  });
  newFarm.save((err)=>{
    if(err){
      throw err;
      return;
    }else{
      res.redirect('/farmer/'+owner);
      }
    });

});

// update farm
router.post('/updatefarm/:farm',(req,res)=>{
  Farm.findOneAndUpdate({'name':req.params.farm},req.body).then((farm)=>{
    res.send(farm);
  });
});

// view all farms owned by the farmer
router.get('/viewfarms/:farmer',(req,res)=>{
  Farm.find({'owner':req.params.farmer}).then((farm)=>{
    res.send(farm);
  });
});

/*router.get('/login/facebook', 
  passport.authenticate('farmerSignin', { scope : 'email' }
));

router.get('/login/facebook/callback',(req,res,next)=>{
  passport.authenticate('farmerSignin',(err, farmer, info)=>{
    if(err){ 
      return next(err); 
    }
    if(!farmer){ 
      return res.redirect('/farmer/login'); 
    }
    req.logIn(farmer, function(err){
      if (err) { return next(err); }
      var name = farmer.name.replace(/ /g,'-');
      return res.redirect('/farmer/' + name);
    });
  })(req, res, next);
});*/

router.get('/register',(req,res)=>{
  res.render('registerF');
});

router.post('/register',(req,res)=>{
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	req.checkBody('firstname', 'First Name is required').notEmpty();
	req.checkBody('lastname', 'Last Name is required').notEmpty();
	req.checkBody('username', 'User Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    	res.render('registerF',{errors:errors});
  }
  else {
    var newFarmer = new Farmer({
    firstname: firstname,
		lastname: lastname,
		username: username,
		email: email,
		password: password,
    });
    bcrypt.genSalt(10,(err,salt)=>{
    	bcrypt.hash(newFarmer.password,salt,(err,hash)=>{
    		if(err){
      			throw err;
      		}
      		newFarmer.password = hash;
      		newFarmer.save((err)=>{
      			if(err){
      				throw err;
      				return;
      			}else{
      				req.flash('success','You are now registered and can now login');
      				res.redirect('/farmer/login');
      				}
      			});
    		});
  		});
    }
});

router.get('/login',(req,res)=>{
	res.render('loginF');
});

router.post('/login',(req,res,next)=>{
	passport.authenticate('local',(err, farmer, info)=>{
    if(err){ 
      return next(err); 
    }
    if(!farmer){ 
      return res.redirect('/farmer/login'); 
    }
    req.logIn(farmer, function(err){
      if (err) { return next(err); }
      var name = farmer.username.replace(/ /g,'-');
      return res.redirect('/farmer/' + name);
    });
  })(req, res, next);
});

router.get('/logout',(req,res)=>{
	req.logout();
	req.flash('You are logged out');
	res.redirect('/farmer/login');
});

module.exports = router;