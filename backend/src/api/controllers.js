/**
 * This file contains the logic for our APIs
 */

import { randomUUID } from "crypto";
import otpServiceObj from "../services/otpService.js";
import { otpQueueingServiceObj } from "../services/queueService.js";

export async function generateOtpController(req, res) {    
    const key = req.body.email;
    console.log(key);
    const jobId = randomUUID();
    try {
        const payload = {
            jobId: jobId,
            type: "SEND_OTP",
            email: key
        }
        
        await otpQueueingServiceObj.addToQueue(payload);
        res.status(202).json({message: "Processing started", jobId: jobId});
    } catch (err) {
        console.log("Error queueing OTP: ", err);
        throw new Error("Error while queueing OTP request: ", err);
    }
    // try {
    //     const response = await otpServiceObj.generateOtp(key);
        
    //     if(!response.success) {
    //         res.status(500).send('Error Generating OTP');
    //     }
    //     res.status(201).send(response);
    // } catch (err) {
    //     console.log("Error generating OTP: ", err);
    //     res.status(500).send('Error generating OTP', err);
    // }
}

export async function validateOtpController(req, res) {
    const key = req.body.email;
    const inputOtp = req.body.code;
    const jobId = req.body.jobId;

    try {
        const response = await otpServiceObj.validateOtp(key, inputOtp, jobId);

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