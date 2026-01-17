/**
 * This File will contain the logic of otp generation
 * and verification function
 */
import { emailSenderObj } from "../adapters/emailAdapter.js";
import { client, subscriberClient } from "../adapters/redisClient.js";
import { randomInt } from "crypto"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// let otp; // tests
class otpService {

    constructor(redisClient, ttl) {
        this.client = redisClient;
        this.ttl = ttl;
    }

    async publishUpdate(jobId, status, stage, message = "") {
        if(!jobId) return;
        const payload = JSON.stringify({ jobId, status, stage, message });
        await this.client.publish("task_updates", payload);
    }
    async generateOtp(key, jobId) {
        const otpGenerated = randomInt(100000, 999999);
        await sleep(2000);
        await this.publishUpdate(jobId, "OTP Generated", 3);
        await sleep(2000);

        // otp = otpGenerated;
        try {
            const redisKey = `otp:${key}`;
            await this.client.pipeline()
            .hset(redisKey, {
                code: otpGenerated,
                attempts: 0,
            })
            .expire(redisKey, this.ttl)
            .exec();
        
            console.log("OTP generated and sent: ", otpGenerated);

            await emailSenderObj.sendEmail(key, otpGenerated);
            await this.publishUpdate(jobId, "OTP Sent", 4);
            await sleep(2000);

            return {success: true, message: "OTP Generated and sent!"};            
        } catch (err) {
            throw new Error("Error generating OTP: ", err);
        }
    }
    
    async validateOtp(key, inputOtp, jobId) {
        try {
            await this.publishUpdate(jobId, "Verifying OTP...", 5);
            await sleep(2000);
            const redisKey = `otp:${key}`;
            const result = await this.client.hgetall(redisKey);
            // console.log(result);
    
            
            if(Object.keys(result).length === 0) {
                console.log("OTP expired or already used");

                await this.publishUpdate(jobId, "OTP Expired", 6, "The code has expired");
                await sleep(2000);
                return {success: false, message: "OTP expired or already used"};
            }
            const code = Number(result.code);
            const attempts = Number(result.attempts);
            console.log("attempts===>", attempts);
            
            if(attempts >= 2) {
                console.log("No more Attempts left");
                await this.client.del(redisKey)

                await this.publishUpdate(jobId, "Max Attempts Reached", 6, "Too many failed attempts");
                await sleep(2000);
                return {success: false, message: "No more Attempts left"};
            }  
            if(code === inputOtp) {
                console.log("OTP Verified!");
                await this.client.del(redisKey);
                await this.publishUpdate(jobId, "OTP Verified", 6, "Success!");
                await sleep(2000);
                return {success: true, message: "OTP Verified!"};            
            }    
            else {
                const left = 2 - attempts;
                console.log(`Attempt failed ${inputOtp}, attempts remaining - ${left}, try again`);
                await this.client.hincrby(redisKey, "attempts", 1);
                await this.publishUpdate(jobId, "Wrong OTP", 6, `Wrong code. ${left} attempts left.`);
                await sleep(2000);
                return {success: false, message: `Attempt failed ${inputOtp}, attempts remaining - ${(2 - attempts)}, try again`};
            }            
        }
        catch(err) {
            throw new Error(`Error validating OTP ${key} ${inputOtp}: `, err);
        }
    }
}

const otpServiceObj = new otpService(client, 300);

export default otpServiceObj;
// tests: -

// generateOtp(3424);
// await validateOtp(3424, 123111);
// await validateOtp(3424, otp);
// await validateOtp(3424, otp);




