/**
 * This file contains all the various
 * routes that we will be having for this
 * project
 */
import { Router } from "express";
import otpServiceObj from "../services/otpService.js";
import { generateOtpController, validateOtpController } from "./controllers.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import { emailValidator, otpValidator } from "./middlewares/validator.js";

const router = new Router;

export const generateOtp = router.post("/generate", emailValidator, rateLimiter, generateOtpController);

export const verifyOtp = router.post("/verify", otpValidator, validateOtpController);