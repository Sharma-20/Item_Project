
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const itemSchema = mongoose.Schema(
	{
		itemId: {
			type: Number,
			required: true,
		},
		price: {
			type: Number,
		},
		description: {
			type: String,
		},
		name: {
			type: String,
		},
		image: {
			type: String,
		},
		phoneNumber: {
			type: Number,
		},
	},

	{ timestamps: true }
);

autoIncrement.initialize(mongoose.connection);
itemSchema.plugin(autoIncrement.plugin, {
	model: 'itemdbs',
	field: 'itemId',
	startAt: 1,
	incrementBy: 1,
});

const itemModel = mongoose.model('itemdbs', itemSchema);
module.exports = itemModel;