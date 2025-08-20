const joi = require('joi');

        // const tutorialValidationSchema = joi.object({
        //     title: joi.string().min(3).max(100).required(),
        //     description: joi.string().max(500).optional(),
        //     published: joi.boolean().optional()
        // });

const userValidationSchema = joi.object({
    username: joi.string().max(30).min(3).required(),
    email: joi.string().email().required(),
    lastname: joi.string().max(30).min(3).required(),
});

//password validation schema
const password = joi.object({
    password: joi.string().min(6).required(),
    confirmPassword: joi.any()
    .equal(joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Passwords do not match' })})
    .with('password', 'confirmPassword');

    //role validation schema
const roleValidationSchema = joi.object({
    isAdmin: joi.boolean().required(),
    accessCode: joi.string().when('isAdmin',{
        is: true,
        then: joi.string().required(),
        otherwise: joi.string().forbidden()
    })
});

//craete vs update validation schema
const updateSchema = joi.object({
    _id: joi.string().optional(),
    email: joi.string().email().required(),
    password: joi.string().when('_id', {
        is: joi.exist(),
        then: joi.optional(),
        otherwise: joi.required()
    })
})

//customs validation schema
//1 custom validation of error messsage

const schema = joi.object({
    username: joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
        'string.base': "username dorsnt exist",
        'string.empty':"username cannot be empty",
        'string.min':"username must be at least 3 characters long",
        'string.max':"username must be at most 30 characters long",
        'any.required':"username is required"
    })
})

//custom validation logic
const schema2 = joi.object({
    username: joi.string().custom((value,helpers)=>{
        if(value === 'admin'){
            return helpers.message('username "admin" is not allowed');  
        }
        return value;
    })
})


module.exports = {
    userValidationSchema
};