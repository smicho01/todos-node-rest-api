const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const ToDo = require('../models/ToDo');
const User = require('../models/User')
const Category = require('../models/Category');

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
        })
        .populate('category', ['id', 'name', 'color'])
        .populate('user', ['id','username'])
        .exec()

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
        const category = await Category.findById(req.params.categoryId)

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
                                .populate('user')
                                .populate('category')
                                .exec()

        if(!authOwner(foundToDo.user.id, req)) {
            return res.status(403).send({message: "Unauthorized access"})
        }

        return res.status(200).send(foundToDo)
    } catch (err) {
        return res.status(404).send({message: "ToDo not found"})
    }
})

/* Add ToDo */
/*
{
    "title": "Learn AWS EC2",
    "category_id": "62b8cab668d2ab1c817f5d65",
    "description" : "must do it by end of Sept 2022",
    "urgent": true
}
*/
router.post('/', authUser, async(req, res) => {

    const { error } = todoValidation(req.body);
    const authenticatedUserId = getAuthUserId(req);

    if(error) {
        return res.status(500).send({message: error['details'][0]['message']})
    }

    try {
        // Find user to assing a category to him.
        const user = await User.findById(authenticatedUserId);
      
        const newTodo = new ToDo ({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            category: req.body.category_id,
            user: user._id,
            description: req.body.description ? req.body.description : '',
            urgent: req.body.urgent ? req.body.urgent : false,
        });

        // Save ToDo
        const savedTodo = await newTodo.save();

        // Saving ToDo to the User to maintain relation.
        user.todos.push(savedTodo);
        user.save();

        // Assign todo to the chosen category
        const category = await Category.findById(savedTodo.category)
        category.todos.push(savedTodo)
        category.save()

        return res.status(201).send(savedTodo)
    } catch (err) {
        return res.status(500).send({ message: 'Error message' + err })
    }
})

router.patch("/:todoId", authUser, async (req, res) => {
    const todoId = req.params.todoId;
    try {

        LOGGER.log("Attept to update ToDo id:" + todoId, req);
        const todo = await ToDo.findById(todoId).populate('user').exec();

        // Check if authenticated user owns ToDo
        const authenticatedUserId = getAuthUserId(req);
        const user = await User.findById(authenticatedUserId);
        if(!authOwner(foundToDo.user.id, req)) {
            return res.status(403).send({message: "Unauthorized access"})
        }

        
        Object.assign(todo, req.body);
        todo.save();
        LOGGER.log("Todo Updated , id:" + todoId, req);
        return res.status(200).send(todo)
    } catch (error) {
        LOGGER.log("Error updating todo , id:" + todoId + ' , message: ' + error, req);
        return res.status(404).send({message: 'Error: ' + error})
    }

    res.send('ss')
});

router.delete("/:todoId", authUser, async (req, res) => {
    const todoId = req.params.todoId;

    // check if authorized user is the owner of the todo
    try {
        const foundToDo = await ToDo.findById(todoId)
                .populate('user')
                .populate('category')
                .exec();

        // check if the user owns the todo
        if(!authOwner(foundToDo.user.id, req)) {
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