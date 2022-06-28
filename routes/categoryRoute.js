const express = require('express');
const router = express.Router();

const Category = require('../models/Category');
const {todoValidation} = require('../validators/validation');
const { authUser, authRole, authOwner, getAuthUserId } = require('../verifyToken');

/* Get All Categories: for authentocated user only */
router.get('/', authUser,   async (req, res) => {
    const authenticatedUserId = getAuthUserId(req);
    try {
        const categories = await Category.find({
            owner_id: authenticatedUserId
        });
        return res.status(200).send(categories)
    } catch (error) {
        return res.status(400).send({message:error})
    }
})


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
                { owner_id: authenticatedUserId }
            ]
        });

        // If found with the same name or color then create error
        if(categories.length >0) {
            return res.status(409).send({ message: 'Name or color already in use' })
        }
    } catch (error) {
        return res.status(500).send({ message: error })
    }

    const newCategory = new Category ({
        name: req.body.name,
        owner_id: authenticatedUserId,
        color: req.body.color
    });

    try {
        const savedCategory = await newCategory.save();
        return res.status(201).send(savedCategory)
    } catch (err) {
        return res.status(500).send({ message: err })
    }
})


module.exports = router;