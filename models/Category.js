const mongoose = require('mongoose');
const User = require('./User')

const CategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        minlength: 3,
        max: 50
    },
    color: {
        type: String,
        required: true,
        max: 30
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
})
const Category = mongoose.model('Category', CategorySchema);
module.exports = Category