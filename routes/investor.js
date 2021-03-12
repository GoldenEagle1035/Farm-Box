/*jshint esversion: 6 */
var express = require('express');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var router = express.Router(); //Express router is used to creat the api 
var Investor = require('../models/investor_model'); //Require the model for creating an investor
var Farm = require('../models/farm_model');

router.get('/farms',ensureAuthenticated,(req,res)=>{
  Farm.find().sort(price).then((farm)=>{
    res.send(farm);
  });
});

router.post('/invest/:investor/:farm',ensureAuthenticated,(req,res)=>{
  var query = {'investor':req.params.investor};
  Farm.findOneAndUpdate({'name':req.params.farm.replace(/-/g,' ')},query).then((farm)=>{
    var path = '/investor/'+req.params.investor;
    res.redirect(path); 
  });
});
router.get('/farmowned/:investor',ensureAuthenticated,(req,res)=>{
  Farm.find({'investor':req.params.investor}).then((farm)=>{
    res.send(farm);
  });
});

router.get('/profile/:investor',ensureAuthenticated,(req,res)=>{
  Investor.find({'username':req.params.investor}).then((investor)=>{
    res.send (investor);
  });
});

router.get('/findfarms',ensureAuthenticated,(req,res)=>{
  Farm.find().then((farm)=>{
    res.send(farm);
  });
});

router.get('/invest/findfarms',ensureAuthenticated,(req,res)=>{
  Farm.find().then((farm)=>{
    res.send(farm);
  });
});

router.post('/updateprofile/:investor',ensureAuthenticated,(req,res)=>{
  Investor.findOneAndUpdate({'username':req.params.investor},req.body).then((investor)=>{
    res.send(investor);
  });
});

/*router.get('/login/facebook', 
  passport.authenticate('investorSignin', { scope : 'email' }
));

router.get('/login/facebook/callback',(req,res,next)=>{
  passport.authenticate('investorSignin',(err, investor, info)=>{
    if(err){ 
      return next(err); 
    }
    if(!investor){ 
      return res.redirect('/investor/login'); 
    }
    req.logIn(investor, function(err){
      if (err) { return next(err); }
      var name = investor.name.replace(/ /g,'-');
      return res.redirect('/investor/' + name);
    });
  })(req, res, next);
});*/

router.get('/register',(req,res)=>{
	res.render('registerI');
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
  	var newInvestor = new Investor({
		firstname: firstname,
		lastname: lastname,
		username: username,
		email: email,
		password: password,
	});
	bcrypt.genSalt(10,(err,salt)=>{
  		bcrypt.hash(newInvestor.password,salt,(err,hash)=>{
  			if(err){
    				throw err;
    			}
    			newInvestor.password = hash;
    			newInvestor.save((err)=>{
    				if(err){
    					throw err;
    					return;
    				}else{
    					req.flash('success','You are now registered and can now login');
    					res.redirect('/investor/login');
    				}
    			});
  		});
		});
  }
});

router.get('/login',(req,res)=>{
	res.render('loginI');
});


router.post('/login',(req,res,next)=>{
  passport.authenticate('local',(err, investor, info)=>{
    if(err){ 
      return next(err); 
    }
    if(!investor){ 
      return res.redirect('/investor/login'); 
    }
    req.logIn(investor, function(err){
      if (err) { return next(err); }
      var name = investor.username.replace(/ /g,'-');
      return res.redirect('/investor/' + name);
    });
  })(req, res, next);
});

router.get('/logout',(req,res)=>{
	req.logout();
	req.flash('You are logged out');
	res.redirect('/investor/login');
});

// Access Control
function ensureAuthenticated(req, res, next){
  	if(req.isAuthenticated()){
    	return next();
  	}else {
    	req.flash('danger', 'Please login');
    	res.redirect('/investor/login');
  	}
}


module.exports = router;
