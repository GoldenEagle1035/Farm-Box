var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var farmSchema = new Schema({
	name: {
		type: String,
		unique: true
	},
	type: {
		type: String,
		required: true		
	},
	price: {
		type: String,
		required: true
	},
	contractPeriod: {
		type: Number,
		required: true
	},
	harvestPeriod: {
		type: Number,
		required: true
	},
	capacity: {
		type: Number,
		required: true
	},
	noHarvested: {
		type: Number,
	},
	return: {
		type: Number,
		required: true
	},
	image: {
		type: String
	},
	owner: {
		type: String
	},
	investor: {
		type: String
	}
});

var Farm = mongoose.model('Farm',farmSchema);
module.exports = Farm;
