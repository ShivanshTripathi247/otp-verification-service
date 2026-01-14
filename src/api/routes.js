/**
 * This file contains all the various
 * routes that we will be having for this
 * project
 */
import { Router } from "express";
import otpServiceObj from "../services/otpService.js";
import { generateOtpController, validateOtpController } from "./controllers.js";

const router = new Router;

export const generateOtp = router.post("/generate", generateOtpController);

export const verifyOtp = router.post("/verify", validateOtpController);