/**
 * This file will contain function that will govern
 * how the OTP queueing logic is implemented
 */

import { client, subscriberClient } from "../adapters/redisClient.js";

class otpQueueingService {
    constructor () {}

    async addToQueue(job) {
        
        try {
            const key = "queue:otp_requests";
            await client.lpush(key, JSON.stringify(job));

            const queueingMessage = JSON.stringify({
                jobId: job.jobId,
                status: "OTP Request Queued!",
                stage: 1
            })
            await client.publish("task_updates", queueingMessage)

            console.log("OTP request add to queue!");
        } catch (err) {
            console.log("Error queueing OTP request: ", err);
            throw new Error("Error while queueing OTP request: ", err);
        }
    }
}

export const otpQueueingServiceObj = new otpQueueingService();