/*jshint esversion: 6 */
var express = require('express');
var router = express.Router(); //Express router is used to creat the api 
var Farm = require('../models/farm_model'); //Require the model for creating an investor

router.post('/createfarm',(req,res)=>{
	Farm.create(req.body).then((farm)=>{
		res.send(farm);
	});
});

router.get('/getfarms',(req,res)=>{
	Farm.find().then((farm)=>{
		res.send(farm);
	});
});

module.exports = router;