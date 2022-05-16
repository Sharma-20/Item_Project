const mongoose = require('mongoose');

/**
 * Establish a connection to database
 */
const connectDatabase = async () => {
	try {
		await mongoose.connect( 'mongodb://localhost:27017/itemListdb', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex:true
		});
	} catch (error) {
		console.log(error.toString());
	}
};


/**
 * Connection status
 * 
 */
const connectionDBStatus = async () => {
	try {
		var db = mongoose.connection;
		db.on("error", (error) => {
			throw new Error("Mongo Connection error");	
		});
		db.once("open", function (callback) {
			console.log("Mongo Successfully Connected ");
		});
	} catch (error) {
		
	}
};

module.exports = {
	connectDatabase,
	connectionDBStatus
};