
const adminModel = require('../models/adminSchema');
const crypto = require('../config/crypto')


const registerAdmin = async (data) => {
	// Hash password
	const hashedPassword = crypto.createHash(data.password);
	data.password = hashedPassword;    // saving the hashed password

	// Save admin in the database
	const admin = new adminModel(data);
	const result = await admin.save(admin);
	return result;
};


const checkAdminRecord = async (data) => {
	try {
		const adminRecord = await adminModel.find(data).exec();
		return { isSuccess: true, data: adminRecord.length > 0 ? true : false };
	} catch (err) {
		return { isSuccess: false, data: "CHECKING_ADMIN_ERROR" };
	}
};


const fetchAdminRecord = async (data) => {
	try {
		const adminRecord = await adminModel.findOne(data).exec();
		if (!adminRecord) {
			return { isSuccess: false, data: "ERROR_MESSAGE.PHONE_NUMBER_NOT_EXIST "};
		} else {
			return { isSuccess: true, data: adminRecord };
		}
	} catch (err) {
		return { isSuccess: false, data: "ERROR_MESSAGE.FETCHING_ADMIN_ERROR "};
	}
};

const updateAdminRecord = async (data) => {
	try {
		const adminUpdateRecord = await adminModel.updateOne(
			{ phoneNumber: data.phoneNumber },
			{ $set: data }
		);
		if (adminUpdateRecord.nModified == 0) {
			return { isSuccess: false, data: ERROR_MESSAGE.ERROR_UPDATE_ADMININFO };
		} else {
			return { isSuccess: true, data: adminUpdateRecord };
		}
	} catch (err) {
		logger.error(ERROR_MESSAGE.ERROR_UPDATE_ADMININFO + err);
		return { isSuccess: false, data: ERROR_MESSAGE.ERROR_UPDATE_ADMININFO };
	}
};



module.exports = {
	registerAdmin,
	checkAdminRecord,
	fetchAdminRecord,
	updateAdminRecord
	
};
