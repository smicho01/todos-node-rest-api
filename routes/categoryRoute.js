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





module.exports = router;