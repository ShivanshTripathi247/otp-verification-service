/**
 * This file contains the logic for our APIs
 */

import otpServiceObj from "../services/otpService.js";

export async function generateOtpController(req, res) {    
    const key = req.body.phone;
    console.log(key);
    
    try {
        const response = await otpServiceObj.generateOtp(key);
        
        if(!response.success) {
            res.status(500).send('Error Generating OTP');
        }
        res.status(201).send(response);
    } catch (err) {
        console.log("Error generating OTP: ", err);
        res.status(500).send('Error generating OTP', err);
    }
}

export async function validateOtpController(req, res) {
    const key = req.body.phone;
    const inputOtp = req.body.code;

    try {
        const response = await otpServiceObj.validateOtp(key, inputOtp);

        if(!response.success) {
            console.log("OTP Rejected", response);
            res.status(400).send(response);
        }

        console.log("OTP Verified", response);
        res.status(200).send(response);
    } catch (err) {
        console.log("Error verifying OTP: ", err);
        throw new Error("Error verifying OTP: ", err);           
    }
}