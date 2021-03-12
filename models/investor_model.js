/*jshint esversion: 6 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var investorSchema = new Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	userId: {
		type: String
	},
	token: {
		type: String
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	image: {
		type: String
	}
});

var Investor = mongoose.model('Investor',investorSchema);
module.exports = Investor;


