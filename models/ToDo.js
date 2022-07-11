const mongoose = require('mongoose');
const User = require('./User')

const ToDoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        max: 256
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    user: {
       type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    completed: {
        type:Boolean,
        default: false
    },
    urgent: {
        type:Boolean,
        default: false
    },
    description: {
        type: String,
        max: 3000
    },
    todo_time: {
        type: Date,
        default: null
    },
    time_created: { 
        type: Date,
        default: Date.now
    },
    time_completed: { 
        type: Date,
        default: null
    }
})

module.exports = mongoose.model('ToDo', ToDoSchema);