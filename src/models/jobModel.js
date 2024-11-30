const { default: mongoose} = require('mongoose');

const JobSchema = new mongoose.Schema({
	title: {
		type: String,
		// required: true,
	},
	description: {
		type: String,
	},
	locationTitle: {
		type: String,
		// required: true,
	},
	locationAddress: {
		type: String,
		// required: true,
	},
	position: {
		type:{
			lat:{
				type: Number,
			},
			long:{
				type: Number,
			}
		},
		// required: true,
	},
	photoUrl: {
		type: String,
		// required: true,
	},
	authorID: {
		type: String,
		// required: true,
	},
	startAt: {
		type: Number,
		// required: true,
	},
	endAt: {
		type: Number,
		// required: true,
	},
	date: {
		type: Number,
		// required: true,
	},
	price: {
		type: Number,
		// required: true,
	},	
	users: {
		type: [String],
	},
	category: {
		type: String,
		// required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	followers: {
		type: [String],
	},
});

const JobModel = mongoose.model('jobs', JobSchema);

module.exports = JobModel;