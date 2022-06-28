const joi = require('joi');

const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username: joi.string().required().min(3).max(256).trim(true),
        email: joi.string().required().min(6).max(256).email().trim(true),
        password: joi.string().required().min(6).max(1024).trim(true),
        roles: joi.array().items(joi.string().alphanum().trim(true))
    });
    return schemaValidation.validate(data);
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email: joi.string().required().min(6).max(256).email(),
        password: joi.string().required().min(6).max(1024)
    });
    return schemaValidation.validate(data);
}

const todoValidation = (data) => {
    const todoValidation = joi.object({
        title: joi.string().required().min(3).max(256),
        category_id: joi.string().required().min(3).max(500),
        description: joi.string().max(2000),
        urgent: joi.boolean()
    })

    return todoValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.todoValidation = todoValidation