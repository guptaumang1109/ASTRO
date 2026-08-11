import User from "../models/User.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const userId = req.session?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const user = await User.findById(userId).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!user) {
      throw new ApiError(401, "User session is invalid");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid session");
  }
});

export const protect = verifyJWT;
