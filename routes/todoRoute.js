const express = require('express');
const router = express.Router();

const ToDo = require('../models/ToDo');
const CategoryModel = require('../models/Category');
const {todoValidation} = require('../validators/validation');
const { authUser, authRole, authOwner, getAuthUserId } = require('../verifyToken');

const Logger = require('../utils/Logger');
const LOGGER = new Logger();


/* Get All ToDos: for authentocated user only */
router.get('/', authUser,   async (req, res) => {
    const authenticatedUserId = getAuthUserId(req);
    try {
        const todos = await ToDo.find({
            owner_id: authenticatedUserId
        });
        LOGGER.log("GET on all user todos" + authenticatedUserId , req)
        return res.status(200).send(todos)
    } catch (error) {
        LOGGER.log("Error on GET on all user todos" + authenticatedUserId , req)
        return res.status(400).send({message:error})
    }
})


/* Gell all todos: by category. User must be todo and category owner */
router.get('/category/:categoryId', authUser, async (req, res) => {
    // Find categoy
    try {
        const category = await CategoryModel.findById(req.params.categoryId)

        if(!authOwner(category.owner_id, req)) {
            return res.status(403).send({message: "Unauthorized access"})
        }
        //return res.status(200).send(category)
    } catch (err) {
        return res.status(404).send({message: "Category not found"})
    }

    // Find todos in category
    try {
        const foundToDosList = await ToDo.find({
            category_id: req.params.categoryId
        })
        return res.status(200).send(foundToDosList)
    } catch (err) {
        return res.status(404).send({message: "ToDos not found"})
    }
})


/* GET One ToDo of the authenticated user */
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


router.post('/', authUser, async(req, res) => {

    const { error } = todoValidation(req.body);
    const authenticatedUserId = getAuthUserId(req);

    if(error) {
        return res.status(500).send({message: error['details'][0]['message']})
    }

    const newTodo = new ToDo ({
        title: req.body.title,
        category_id: req.body.category_id,
        owner_id: authenticatedUserId,
        description: req.body.description ? req.body.description : '',
        urgent: req.body.urgent ? req.body.urgent : false,
    });

    try {
        const savedTodo = await newTodo.save();
        res.status(201).send(savedTodo)
    } catch (err) {
        res.status(500).send({ message: err })
    }
})

router.delete("/:todoId", authUser, async (req, res) => {
    const todoId = req.params.todoId;

    // check if authorized user is the owner of the todo
    try {
        const foundToDo = await ToDo.findById(todoId)
        // check if the user owns the todo
        if(!authOwner(foundToDo.owner_id, req)) {
            return res.status(403).send({message: "Unauthorized access"})
        }
    } catch (err) {
        return res.status(404).send({message: "ToDo not found"})
    }

    // Deleting ToDo
    try {
        ToDo.deleteOne({ _id: todoId }, (err) => {
            if(err) {
                LOGGER.log("ToDo could not be deleted: " + todoId, req)
                return res.status(500).send({message: err})
            }
            LOGGER.log("ToDo deleted: " + todoId, req)
            return res.status(200).send({message: "ToDo deleted"})
        });
    } catch (erro) {
        return res.status(409).send({message: "Error deleting ToDo " + todoId})
    }

});

module.exports = router;