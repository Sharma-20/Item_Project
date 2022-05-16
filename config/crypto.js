
const crypto = require("crypto");
const { CRYPTO_PARAMETER} = require("./constant.js");



const createHash = (text) => {
	const hash = crypto
		.createHash(CRYPTO_PARAMETER.ALGO_SHA)
		.update(text, CRYPTO_PARAMETER.UTF)
		.digest(CRYPTO_PARAMETER.HEX);
	return hash;
};


module.exports = {
	createHash
}
