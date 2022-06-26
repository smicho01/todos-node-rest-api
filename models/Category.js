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
    }
})

module.exports = mongoose.model('category', CategorySchema);