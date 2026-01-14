/**
 * This File will contain the logic of otp generation
 * and verification function
 */
import client from "../adapters/redisClient.js";
import { randomInt } from "crypto"

// let otp; // tests
class otpService {

    constructor(redisClient, ttl) {
        this.client = redisClient;
        this.ttl = ttl;
    }

    async generateOtp(key) {
        const otpGenerated = randomInt(100000, 999999);
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
        
            console.log("OTP generated: ", otpGenerated);
            return {success: true, message: "OTP Generated!"};            
        } catch (err) {
            throw new Error("Error generating OTP: ", err);
        }
    }
    
    async validateOtp(key, inputOtp) {
        try {
            const redisKey = `otp:${key}`;
            const result = await this.client.hgetall(redisKey);
            // console.log(result);
    
            
            if(Object.keys(result).length === 0) {
                console.log("OTP expired or already used");
                return {success: false, message: "OTP expired or already used"};
            }
            const code = Number(result.code);
            const attempts = Number(result.attempts);
            console.log("attempts===>", attempts);
            
            if(attempts >= 2) {
                console.log("No more Attempts left");
                await this.client.del(redisKey)
                return {success: false, message: "No more Attempts left"};
            }  
            if(code === inputOtp) {
                console.log("OTP Verified!");
                await this.client.del(redisKey);
                return {success: true, message: "OTP Verified!"};            
            }    
            else {
                const left = 2 - attempts;
                console.log(`Attempt failed ${inputOtp}, attempts remaining - ${left}, try again`);
                await this.client.hincrby(redisKey, "attempts", 1);
                const now = await this.client.hgetall(redisKey);
                console.log("NOOW =>>",now);
                
    
                return {success: false, message: `Attempt failed ${inputOtp}, attempts remaining - ${(2 - attempts)}, try again`};
            }            
        }
        catch(err) {
            throw new Error(`Error validating OTP ${key} ${inputOtp}: `, err);
        }
    }
}

const otpServiceObj = new otpService(client, 60);

export default otpServiceObj;
// tests: -

// generateOtp(3424);
// await validateOtp(3424, 123111);
// await validateOtp(3424, otp);
// await validateOtp(3424, otp);




