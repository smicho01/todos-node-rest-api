/**
 *  Author: Seweryn Michota
 *  Date: February 2022
 */
const mongoose = require('mongoose')

const logSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    message: {
        type: String
    }
})

module.exports = mongoose.model('logs', logSchema)