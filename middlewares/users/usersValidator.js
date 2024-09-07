const { check, validationResult } = require('express-validator');
const createError = require('http-errors');
const User = require('../../models/People');
const path = require('path');
const { unlink } = require('fs');

const addUserValidator = [
    check('name').isLength({min: 3})
                 .withMessage("Name is required")
                 .isAlpha("en-US", {ignore: ' -'})
                 .withMessage("Name Must not contain anything other than alphabet.")
                 .trim(),
    check('email').isEmail()
                  .withMessage("Invalid Email")
                  .trim()
                  .custom(async (value) => {
                        try{
                            const user = await User.findOne({email: value});
                            if(user){
                                throw createError("Email already exists!!");
                            }
                        }catch(e){
                            throw createError(e.message);   
                        }
                  }),
    check('mobile').isMobilePhone("bn-BD", {strictMode: true })   
                   .withMessage("Mobile Number must be a Bangladeshi Mobile number")
                   .custom(async (value) => {
                        try{
                            const user = await User.findOne({mobile: value});
                            if(user){
                                throw createError("Mobile already exists!!");
                            }
                        }catch(e){
                            throw createError(e.message);   
                        }
                   }),
    check('password').isStrongPassword()
                     .withMessage("Password must be at least 8 characters and should contain at least 1 lowercase, 1 uppercase and 1 symbol")                
];

const addUserValidationHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if(Object.keys(mappedErrors).length === 0){
        next();
    }else{
        // remove the uploaded files if any
        if(req.files.length > 0){
            const { filename } = req.files[0];
            unlink(
               path.join(__dirname, `/../public/uploads/avatars/${filename}`),
               (err) => {
                if(err) console.log(err);
               } 
            );
        }

        res.status(500).json({
            errors: mappedErrors
        })
    }
}

module.exports = {
    addUserValidator,
    addUserValidationHandler
}