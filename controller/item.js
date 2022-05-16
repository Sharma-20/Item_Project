const {
	registerItem,
	updateItemRecord,
	fetchItemRecord,
	fetchAllItemRecord,
	fetchItemOrderRecord,
	deleteItemRecord
} = require('../services/item.js');    //
const { checkAdminRecord } = require('../services/admin.js');
const {
	verifyJws,
	decryptJwe
} =  require('../config/jsonWebToken');
const {REQ_HEADER} = require('../config/constant')


const addItem = async (request, response) => {
	try {
		//CHECK IF DATA IS PROVIDED
		if (
			!('name' in request.body) ||
			!('description' in request.body) ||
			!('price' in request.body) ||
			!('image' in request.body)
		) {
			return response
				.json("REQUIRED_PARAMETERS_MISSING");
		}

		const token = request.header(REQ_HEADER.X_AUTH_TOKEN);
		console.log(token)

		// Verify Token
		const verifiedToken = await verifyJws(token);
		if (!verifiedToken.isSuccess) {
			return response
				.json("ERROR_MESSAGE-INVALID_TOKEN");
		}

		// Decrypt Jwe Token
		const decryptedData = await decryptJwe(verifiedToken.data);
		const phoneNumber = decryptedData.data.phoneNumber;
		console.log(phoneNumber)

		const data = {
			name: request.body.name,
			description:request.body.description ,
		    price: request.body.price,
			image: request.body.image,
			phoneNumber: phoneNumber,
		};
		console.log(data)

		// check if writer's phone number exists
		const adminIdExists = await checkAdminRecord({ phoneNumber: phoneNumber });

		if (!adminIdExists.data) {
			return response
				.json("Admin not exist in database");
		} else {
			const itemRecord = await registerItem(data);
			console.log(itemRecord)
				return response.json(itemRecord);
			
		}
	} catch (err) {
		response.send(err)
	}
};

const fetchItem = async (request, response) => {
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
		const phoneNumber = decryptedData.data.phoneNumber;

		const fetchitemResponse = await fetchItemRecord({ phoneNumber });
		console.log(fetchitemResponse)

		if (!fetchitemResponse.isSuccess) {
			return response
				.json(errorResponse(fetchitemResponse.data));
		} else {
			return response.json(fetchitemResponse);
		}
	} catch (err) {
		response.send(err)
	}
};

const updateItem = async (request, response) => {
	try {
		//CHECK IF DATA IS PROVIDED
		if (!('itemId' in request.body)) {
			return response
				.json("ERROR_MESSAGE.REQUIRED_PARAMETERS_MISSING");
		}

		const token = request.header(REQ_HEADER.X_AUTH_TOKEN);
		console.log(token)

		// Verify Token
		const verifiedToken = await verifyJws(token);
		if (!verifiedToken.isSuccess) {
			return response
				.json("ERROR_MESSAGE.INVALID_TOKEN");
		}

		// Decrypt Jwe Token
		const decryptedData = await decryptJwe(verifiedToken.data);
		const phoneNumber = decryptedData.data.phoneNumber;
		console.log(phoneNumber)
		const itemId = request.body.itemId;
	    const name = request.body.name;
		const description= request.body.description ;
		const  price= request.body.price;
		const image= request.body.image;
		

		const data = {
			itemId: itemId,
			name: name,
			description: description,
			price: price,
			image: image,
			phoneNumber: phoneNumber,
		};
		

		const updateData = {};
		for (var attributename in data) {
			if (data[attributename] != null) {
				updateData[attributename] = data[attributename];
			}
		}

		// check if writer's phone number exists
		const adminIdExists = await checkAdminRecord({ phoneNumber: phoneNumber });

		if (!adminIdExists.data) {
			return response
				.json("ERROR_MESSAGE.WRITER_NOT_EXISTS");
		} else {
			const itemRecord = await updateItemRecord(data);

			return response.json(itemRecord);
		}
	} catch (err) {
		response.send(err)
	}
};


const deleteItem = async (request, response) => {
	try {
		const token = request.header(REQ_HEADER.X_AUTH_TOKEN);

		// Verify Token
		const verifiedToken = await verifyJws(token);
		if (!verifiedToken.isSuccess) {
			return response
				.status(HTTP_STATUS_CODE.UNAUTHORIZED)
				.json(errorResponse(ERROR_MESSAGE.INVALID_TOKEN));
		}

		// Decrypt Jwe Token
		const decryptedData = await decryptJwe(verifiedToken.data);
		const phoneNumber = decryptedData.data.phoneNumber;
		const itemId = request.body.itemId;

		const adminExists = await checkAdminRecord({ phoneNumber: phoneNumber });
		if (!adminExists.data) {
			return response
				.json("ERROR_MESSAGE: ADMIN_NOT_EXISTS");
		} else {
			const fetchitemResponse = await fetchItemRecord({ phoneNumber });

			let itemIdExist = false;
			fetchitemResponse.data.forEach((element) => {
				const record = element;
				if (record.itemId == itemId) {
					itemIdExist = true;
				}
			});
			if (itemIdExist) {
				const deleteitemResponse = deleteItemRecord({ itemId});
				return response
					.json("SUCCESS_MESSAGE.DELETE_item_RECORD");
			} else {
				return response
					.json("ERROR_MESSAGE.itemID_NOT_EXIST");
			}
		}
	} catch (err) {
		response.send(err);
	}
};

const fetchAllItem = async (request, response) => {
	try {

		const fetchAllitemResponse = await fetchAllItemRecord();
		if (!fetchAllitemResponse.isSuccess) {
			return response
				.json(fetchAllitemResponse.data);
		} else {
			return response
				.json(fetchAllitemResponse);
		}
	} catch (err) {
		response.send(err);
	}
};



module.exports = {
	addItem,
	fetchItem,
	updateItem,
	deleteItem,
	fetchAllItem
};
