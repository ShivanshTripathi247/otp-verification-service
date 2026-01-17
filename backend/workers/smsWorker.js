/**
 * This file will Implement the contact between
 * our code with GSM mobile SIM card service
 */

import { client, subscriberClient } from "../src/adapters/redisClient.js";
import otpServiceObj from "../src/services/otpService.js";
import http from 'http';

const healthServer = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Worker is running');
});

const PORT = process.env.PORT || 10000;
healthServer.listen(PORT, () => {
    console.log(`Worker health check listening on port ${PORT}`);
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function otpGeneratingWorker() {
    let jobId;
    while(true) { 
        try {
            const response = await client.brpop("queue:otp_requests", 0);
        
            if(response != null) {
                const job = JSON.parse(response[1]);

                jobId = job.jobId;
                const processingMsg = JSON.stringify({
                    jobId: jobId,
                    status: "OTP Processing",
                    stage: 2
                })
                await sleep(2000);
                await client.publish("task_updates", processingMsg);
                await otpServiceObj.generateOtp(job.email, jobId);
            }
        } catch (err) {
            console.log("Error generating OTP for job: ", jobId);
            throw new Error("Error while generating OTP for job: ", err);    
        }
    }
}

const appy = express();


otpGeneratingWorker();