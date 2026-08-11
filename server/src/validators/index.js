import {body} from 'express-validator';

const userRegisterValidator = () => {
    return [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Name is required"),
          
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Please enter a valid email address"),

        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")    
    ]
}

const userLoginValidator = () => {
    return [
        body("email")
          .trim()
          .notEmpty()
          .withMessage("Email is required")
          .isEmail()
          .withMessage("Please enter a valid email address"),
        
        body("password")
           .notEmpty()
           .withMessage("Password is required"),  
    ]
}

const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword")
          .notEmpty()
          .withMessage("Old Password is required"),
        
        body("newPassword")
          .notEmpty()
          .withMessage("New Password is required") ,

    ]
}

const userForgotPasswordValidator = () => {
    return [
        body("email")
           .trim()
           .notEmpty()
           .withMessage("Email is required")
           .isEmail()
           .withMessage("Please enter a valid email address")
    ]
}

const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword")
           .notEmpty()
           .withMessage("Password is required"),
    ]
}

export {
    userChangeCurrentPasswordValidator ,
    userForgotPasswordValidator ,
    userLoginValidator ,
    userRegisterValidator ,
    userResetForgotPasswordValidator
}