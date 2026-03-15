const Joi = require("joi");

const registerSchema = Joi.object({
    gender: Joi.string().required(),
    name: Joi.string().min(3).max(12).required(),
    age: Joi.number().min(18).max(65).required(),
    login: Joi.string().min(3).max(12).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

module.exports = registerSchema;
