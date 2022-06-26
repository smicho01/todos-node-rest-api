const express = require('express');
const router = express.Router();

const ToDo = require('../models/ToDo');
const {todoValidation} = require('../validators/validation');
const { authUser, authRole, authOwner, getAuthUserId } = require('../verifyToken');

/* Get All ToDos: for authentocated user only */
router.get('/', authUser,   async (req, res) => {
    const authenticatedUserId = getAuthUserId(req);
    try {
        const todos = await ToDo.find({
            owner_id: authenticatedUserId
        });
        return res.status(200).send(todos)
    } catch (error) {
        return res.status(400).send({message:error})
    }
})

/* 
*   GET One ToDo
*/
router.get('/:todoId', authUser, async (req, res) => {
    try {
        const foundToDo = await ToDo.findById(req.params.todoId)

        if(!authOwner(foundToDo.owner_id, req)) {
            return res.status(403).send({message: "Unauthorized access"})
        }

        return res.status(200).send(foundToDo)
    } catch (err) {
        return res.status(404).send({message: "ToDo not found"})
    }
})


router.post('/', async(req, res) => {
    const {error} = todoValidation(req.body);

    if(error) {
        return res.status(500).send({message: error['details'][0]['message']})
    }

    const newTodo = {
        title: req.body.title,
        category_id: req.body.category_id,
        owner_id: req.body.owner_id,
    }
})

module.exports = router;