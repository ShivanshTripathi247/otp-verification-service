/** 
 * This file controls the rate limiting 
 * logic of our OTP generation endpoint
*/

import { client } from "../../adapters/redisClient.js";

export async function rateLimiter(req, res, next) {
    try {
        const email = req.body.email;
        const redisKey = `otp:${email}`;
        const exist = await client.exists(redisKey);

        if(exist == 1) {
            const ttl = await client.ttl(redisKey);
            res.status(429).send({success: false, message: `Too many requests, try after ${ttl} seconds.`});
        }
        else {
            next();
        }
    } catch (err) {
        console.log("Error in middleware: ", err);
        throw new Error("Error proccessing middleware: ", err);        
    }
}