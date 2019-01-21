var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var BookingSchema = new mongoose.Schema({

	starttime: {
		type: String,
		required: true
	},
	endtime: {
		type: String,
		required: true
	},
	startminutes: {
		type: Number,
		required: true
	},
	endminutes: {
		type: Number,
		required: true
        }, 
	room: {
		type: String,
		required: true
	},
	bookingdate: {
		type: String,
		required: true
	},
	owner: {
		type: String,
		required: true
	},
	role: {
		type: String,
		enum: ['reader', 'creator', 'editor'],
		default: 'reader'
	}

}, {
	timestamps: true
});



module.exports = mongoose.model('Booking', BookingSchema);
