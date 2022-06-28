const mongoose = require('mongoose');

const ToDoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        max: 256
    },
    category_id: {
        type: String,
        required: true,
        max:500
    },
    owner_id: {
        type: String,
        required: true,
        max:500
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
    time_created: { 
        type: Date,
        default: Date.now
    },
    time_completed: { 
        type: Date,
        default: null
    }
})

module.exports = mongoose.model('todos', ToDoSchema);