const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
require('dotenv/config')

const app = express()
app.use(bodyParser.json())

/* Route: Auth */
const authRoute = require('./routes/authRoute')
app.use('/api/users', authRoute)

/* Route: Todo */
const todoRoute = require('./routes/todoRoute')
app.use('/api/todo', todoRoute)

/* Route: Category */
const categoryRoute = require('./routes/categoryRoute')
app.use('/api/category', categoryRoute)

MURL = process.env.MURL
mongoose.connect(MURL, () => {
    console.log("Connection to MongoDB Atlas: ok")
})

app.listen(3005, () => {
    console.log("ToDo App is running: ON")
})