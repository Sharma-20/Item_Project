const jwt = require('jsonwebtoken');
const jose = require('node-jose');

const { JWKCONFIG } = require('./jwk.js');


const createJwe = async (data) => {
	try {
		// Import JWK
		const key = await jose.JWK.asKey(JWKCONFIG.exportedJwk);
		// Create JWE
		const jwe = await jose.JWE.createEncrypt(key).update(JSON.stringify(data)).final();
		return { isSuccess: true, data: jwe };
	} catch (err) {
		return { isSuccess: false, data: err };
	}
};


const createJws = (data) => {
	return jwt.sign(data, JWKCONFIG.Secret_Key,{expiresIn: '7h'});
};



const verifyJws = (token) => {
	try {
		return { isSuccess: true, data: jwt.verify(token, JWKCONFIG.Secret_Key) };
	} catch (err) {
		return { isSuccess: false, data: err };
	}
};



const decryptJwe = async (token) => {
	try {
		// Import JWK
		const key = await jose.JWK.asKey(JWKCONFIG.exportedJwk);

		// Decrypt JWE
		const decryptedJwe = await jose.JWE.createDecrypt(key).decrypt(token);
		const data = decryptedJwe.payload.toString('utf-8');
		return { isSuccess: true, data: JSON.parse(data) };
	} catch (err) {
		return { isSuccess: false, data: err };
	}
};


module.exports = {
	createJwe,
	createJws,
	verifyJws,
	decryptJwe
};
