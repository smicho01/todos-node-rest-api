const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Category = require('../models/Category');
const User = require('../models/User')

const {todoValidation} = require('../validators/validation');
const { authUser, authRole, authOwner, getAuthUserId } = require('../verifyToken');

/* Get All Categories: for authentocated user only */
router.get('/', authUser,   async (req, res) => {
    const authenticatedUserId = getAuthUserId(req);
    try {
        const categories = await Category.find({
            user: authenticatedUserId
        });
        return res.status(200).send(categories)
    } catch (error) {
        return res.status(400).send({message:error})
    }
})

router.get('/:categoryId', authUser,   async (req, res) => {
    const authenticatedUserId = getAuthUserId(req);
    try {
        const category = await Category.findOne({
            _id: req.params.categoryId
        })
        .populate('user',['id','username'])
        .exec();

        return res.status(200).send(category)
    } catch (error) {
        return res.status(400).send({message:error})
    }
})

/* Save Category */
router.post('/', authUser, async(req, res) => {
    const authenticatedUserId = getAuthUserId(req);

    // Check if category exists and if color is in use
    try {
        const categories = await Category.find({
            $or: [{
                    name: req.body.name
                },
                {
                    color: req.body.color
                }
            ],
            $and: [
                { user: authenticatedUserId }
            ]
        });

        // If found with the same name or color then create error
        if(categories.length > 0) {
            return res.status(409).send({ message: 'Name or color already in use' })
        }
    } catch (error) {
        return res.status(500).send({ message: error })
    }

    // Find user to assing a category to him.
    const user = await User.findById(authenticatedUserId);
  
    const newCategory = new Category ({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        user: user._id,
        color: req.body.color
    });

    try {
        // Save category
        const savedCategory = await newCategory.save();
        
        // Saving category to the User to maintain relations
        user.categories.push(savedCategory);
        user.save()
        return res.status(201).send(savedCategory)
    } catch (err) {
        return res.status(500).send({ message: 'Error' + err })
    }
    

})


module.exports = router;