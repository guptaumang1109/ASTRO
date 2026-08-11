import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({
        [err.path || err.param]: err.msg
    }));

    return res.status(400).json({
        success: false,
        message: extractedErrors[0] ? Object.values(extractedErrors[0])[0] : "Received data is not valid",
        errors: extractedErrors
    });
}