
var express = require('express');
var router = express.Router();

const adminControllers = require('../controller/admin');

router.post('/add', adminControllers.addAdmin);
router.post('/login', adminControllers.login);
router.get('/fetchAdmin', adminControllers.fetchAdmin);
router.put('/update', adminControllers.updateAdmin);


module.exports = router;
