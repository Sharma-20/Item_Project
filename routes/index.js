
const express = require('express')
const app = express()

const admin = require('./admin')
const item = require('./item')


app.use('/admin', admin)
app.use('/item', item)



module.exports = app
