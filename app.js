const express = require('express');
const app = express();
//const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
const { connectDatabase, connectionDBStatus } = require('./services/database.js');


app.use(cors());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(express.static('public'));

app.use('/', indexRouter);

// MongoDB connection
connectDatabase();  //Functions of mongo DB
connectionDBStatus();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log('Server is running on port:' + PORT);
});
