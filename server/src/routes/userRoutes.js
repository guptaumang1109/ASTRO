import express from 'express';
import { 
    changeCurrentPassword, 
    getCurrentUser, 
    login, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    resendEmailVerification, 
    forgotPasswordRequest, 
    resetForgotPassword, 
    verifyEmail, 
    getPublishedImages 
} from '../controllers/userController.js';
import { verifyJWT } from '../middlewares/auth.js';
import { 
    userChangeCurrentPasswordValidator, 
    userForgotPasswordValidator, 
    userLoginValidator, 
    userRegisterValidator, 
    userResetForgotPasswordValidator 
} from '../validators/index.js';
import { validate } from '../middlewares/validator.middleware.js';

const userRouter = express.Router();

// UNSECURED ROUTES
userRouter.route('/register').post(userRegisterValidator(), validate, registerUser);

userRouter.route('/login').post(userLoginValidator(), validate, login);

userRouter.route('/verify-email/:verificationToken').get(verifyEmail);

userRouter.route('/refresh-token').post(refreshAccessToken);

userRouter.route('/forgot-password').post(userForgotPasswordValidator(), validate, forgotPasswordRequest);

userRouter.route('/reset-password/:resetToken').post(userResetForgotPasswordValidator(), validate, resetForgotPassword);

userRouter.get('/published-images', getPublishedImages);
userRouter.get('/published-image', getPublishedImages);

// SECURE ROUTES
userRouter.route('/logout').post(verifyJWT, logoutUser);

userRouter.route('/me').get(verifyJWT, getCurrentUser);

userRouter.route('/change-password').post(verifyJWT, userChangeCurrentPasswordValidator(), validate, changeCurrentPassword);

userRouter.route('/resend-email-verification').post(verifyJWT, resendEmailVerification);

export default userRouter;