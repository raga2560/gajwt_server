var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({

	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	owner: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	comments: {
		type: Array,
		default: '',
	},
	role: {
		type: String,
		enum: ['reader', 'creator', 'editor'],
		default: 'reader'
	}

}, {
	timestamps: true
});


module.exports = mongoose.model('Post', PostSchema);
