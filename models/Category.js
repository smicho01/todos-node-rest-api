const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        max: 50
    },
    owner_id: {
        type: String,
        required: true,
        max:500
    },
    color: {
        type: String,
        required: true,
        max: 30
    }
})

module.exports = mongoose.model('category', CategorySchema);