/**
 *  Author: Seweryn Michota
 *  Date: February 2022
 */
const { array, number } = require('joi');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 256
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now
    },
    roles: {
        type:Array,
        min:3,
        max:100,
        default: ["user"]
    },
    active: {
        type:Boolean,
        default:true
    },
    penalties: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('users', userSchema)