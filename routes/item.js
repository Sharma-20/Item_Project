
var express = require('express');
var router = express.Router();

const itemController = require('../controller/item')

router.post('/addItem',itemController.addItem);
router.get('/fetchItem', itemController.fetchItem);
router.get('/fetchAllItem', itemController.fetchAllItem);
router.put('/updateItem',itemController.updateItem)
router.delete('/deleteItem',itemController.deleteItem)


module.exports = router;