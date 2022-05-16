const {
	createJwe,
	createJws,
	verifyJws,
	decryptJwe
} =  require('../config/jsonWebToken');
const emailvalidator = require('email-validator');
const crypto = require('../config/crypto')
const {REQ_HEADER} = require('../config/constant')
const {
	registerAdmin,
	checkAdminRecord,
	fetchAdminRecord,
	updateAdminRecord
} = require('../services/admin.js');

const addAdmin = async (request, response) => {
	try {
		//CHECK IF DATA IS PROVIDED
		if (
			!('phoneNumber' in request.body) ||
			!('name' in request.body) ||
			!('email' in request.body) ||
			!('password' in request.body) ||
			!(request.body.name != '') ||
			!(request.body.phoneNumber != '')||
			!(request.body.email != '')||
			!(request.body.password != '')
		) {
			return response
				.json("REQUIRED_PARAMETERS_MISSING");
		}

		const data = {
			phoneNumber: request.body.phoneNumber,
			name: request.body.name,
			email: request.body.email,
			password: request.body.password,
		};
	

		if (!emailvalidator.validate(request.body.email)) {
			return response.json("INVALID_INPUT");
		}
		// Check admin does exist or not inside DB
		const phoneNumber = data.phoneNumber
		const checkAdminResponse = await checkAdminRecord({ phoneNumber: phoneNumber });

		if (!checkAdminResponse.isSuccess) {
			return response
				.json("INTERNAL_SERVER_ERROR");
		}
		if (checkAdminResponse.data) {
			return response
				.json("ALREADY_EXIST");
		}
		const result = await registerAdmin(data);
		return response.json(result);
	} catch (err) {
		response.send(err);
	}
};


const login = async (request, response) => {
	try {
		// Check whether input is present or not
		if (!('phoneNumber' in request.body) || !('password' in request.body)) {
			return response
				.json("REQUIRED_PARAMETERS_MISSING");
		}
		const phoneNumber = request.body.phoneNumber;
		const password = request.body.password;

		// Hash password
		const hashedPassword = crypto.createHash(password);
		// Fetch admin record
		const data = { phoneNumber: phoneNumber, password: hashedPassword };
		const fetchAdminResponse = await fetchAdminRecord(data);
		if (!fetchAdminResponse.isSuccess) {
			return response
				.json("ERROR_MESSAGE.ADMIN_NOT_EXISTS");
		} else if (fetchAdminResponse.data === null) {
			return response
				.json("ERROR_MESSAGE.USERNAME_PASSWORD_INCORRECT");
		}

		// 1. Creating JWE
		const jweResponse = await createJwe({
			phoneNumber: phoneNumber,
		});
		if (!jweResponse.isSuccess) {
			return response
				.json("ERROR_MESSAGE.INTERNAL_SERVER_ERROR");
		}
		const jwe = jweResponse.data;
		
		// 2. Signing JWE
		const token = createJws(jwe);
		return response
			.json( { token: token });
	} catch (err) {
		response.send(err);
	}
};


const fetchAdmin = async (request, response) => {
	try {
		const token = request.header(REQ_HEADER.X_AUTH_TOKEN);

		// Verify Token
		const verifiedToken = await verifyJws(token);
		if (!verifiedToken.isSuccess) {
			return response
				.json("ERROR_MESSAGE.INVALID_TOKEN");
		}

		// Decrypt Jwe Token
		const decryptedData = await decryptJwe(verifiedToken.data);
		console.log("decryptedData",decryptedData)
		const phoneNumber = decryptedData.data.phoneNumber;

		const fetchAdminResponse = await fetchAdminRecord({ phoneNumber });
		if (!fetchAdminResponse.isSuccess) {
			return response
				.json(fetchAdminResponse.data);
		} else {
			return response.json(fetchAdminResponse);
		}
	} catch (err) {
		response.send(err);
	}
};


const updateAdmin = async (request, response) => {
	const token = request.header(REQ_HEADER.X_AUTH_TOKEN);
	const password = request.body.password;
	const dob = request.body.dob;
	const email = request.body.email;
	const name = request.body.name;
	let hashedPassword = null;
	if (password != undefined) {
		hashedPassword = crypto.createHash(password);
	}

	//Input validation
	if (email != undefined) {
		if (!emailvalidator.validate(request.body.email)) {
			return response
				.json("ERROR_MESSAGE.INVALID_INPUT");
		}
	}

	// Verify Token
	const verifiedToken = await verifyJws(token);
	if (!verifiedToken.isSuccess) {
		return response
			.json("ERROR_MESSAGE.INVALID_TOKEN");
	}

	// Decrypt Jwe Token
	const decryptedData = await decryptJwe(verifiedToken.data);
	const phoneNumber = decryptedData.data.phoneNumber;

	const data = {
		phoneNumber: phoneNumber,
		password: hashedPassword,
		dob: dob,
		email: email,
		name: name,
	};

	const updateData = {};
	for (var attributename in data) {
		if (data[attributename] != null) {
			updateData[attributename] = data[attributename];
		}
	}
	const updateAdminResponse = await updateAdminRecord(updateData);
	if (!updateAdminResponse.isSuccess) {
		return response
			.json("ERROR_MESSAGE.PHONE_NUMBER_NOT_EXIST");
	} else {
		return response.json(updateAdminResponse);
	}
};



module.exports = {
	addAdmin,
	login,
	fetchAdmin,
	updateAdmin
};
