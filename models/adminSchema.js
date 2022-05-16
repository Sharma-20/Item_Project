const mongoose = require('mongoose');

const adminSchema = mongoose.Schema(
	{
		phoneNumber: {
			type: Number,
			required: true,
		},
		name: {
			type: String,
		},
		email: {
			type: String,
			lowercase: true,
		},
		password: {
			type: String,
		},
	},
	{ timestamps: true }
);

const adminModel = mongoose.model('admindbs', adminSchema);
module.exports = adminModel;
