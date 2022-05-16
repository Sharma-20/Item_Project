const itemModel = require('../models/itemSchema');
const adminModel = require('../models/adminSchema');
const moment = require('moment');
const crypto = require('../config/crypto')


const registerItem = async (data) => {
	const item = new itemModel(data);
	const itemRecord = await item.save(item);
	return itemRecord ;
};

const fetchAllItemByData = async (data) => {
	try {
		const itemRecord = await itemModel.find({ $or: [data] });
		if (!itemRecord) {
			return { isSuccess: false, data: ERROR_MESSAGE.SUPPLIER_NOT_EXIST };
		} else {
			return { isSuccess: true, data: itemRecord };
		}
	} catch (err) {
		return { isSuccess: false, data: 'itemRecord fetching err' };
	}
};

const updateItemRecord = async (data) => {
	try {
		const updateItemRecord = await itemModel.updateOne(
			{ itemId: data.itemId },
			{ $set: data }
		);

		if (updateItemRecord.nModified == 0) {
			return { isSuccess: false, data: ERROR_MESSAGE.ERROR_UPDATE_item };
		} else {
			return { isSuccess: true, data: updateItemRecord };
		}
	} catch (err) {
		return { isSuccess: false, data: "ERROR_UPDATE_item "};
	}
};



const fetchItemOrderRecord = async (data) => {
	try {
		const adminitemRecord = await itemModel.find(data).exec();

		if (!adminitemRecord) {
			return { isSuccess: false, data: "Not get item details" };
		} else {
			return { isSuccess: true, data: adminitemRecord };
		}
	} catch (err) {
		
		return { isSuccess: false, data: "ERROR_GET_DETAILS_ITEM" };
	}
};

const fetchItemRecord = async (data) => {
	try {
		const adminitemRecord = await itemModel.find(data).exec();

		if (!adminitemRecord) {
			return { isSuccess: false, data: "ERROR_GET_DETAILS_ITEM" };
		} else {
			return { isSuccess: true, data: adminitemRecord };
		}
	} catch (err) {
		
		return { isSuccess: false, data:"ERROR_GET_DETAILS_ITEM"};
	}
};


const fetchAllItemRecord = async () => {
	try {
		const adminitemRecord = await itemModel
			.find()
		if (!adminitemRecord) {
			return { isSuccess: false, data: "item_NOT_EXIST" };
		} else {
			return { isSuccess: true, data: adminitemRecord };
		}
	} catch (err) {
		return { isSuccess: false, data: "FETCHING_ADMIN_ERROR" };
	}
};

const deleteItemRecord = async (data) => {
	try {
		const adminitemRecord = await itemModel.findOneAndDelete(data).exec();
		if (!adminitemRecord) {
			return { isSuccess: false, data: "item_NOT_EXIST" };
		} else {
			return { isSuccess: true, data: adminitemRecord };
		}
	} catch (err) {
		
		return { isSuccess: false, data: "FETCHING_ADMIN_ERROR" };
	}
};





module.exports = {
	registerItem,
	updateItemRecord,
	fetchItemRecord,
	fetchAllItemRecord,
	fetchItemOrderRecord,
	deleteItemRecord
};
