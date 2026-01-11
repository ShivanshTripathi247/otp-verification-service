/**
This file manages the connection beteen
 */
import Redis from "ioredis";
import { REDIS_PORT, REDIS_HOSTNAME, REDIS_DB} from "../utils/helper.js";

// console.log(REDIS_PORT);

const client = new Redis({
    port: REDIS_PORT,
    host: REDIS_HOSTNAME,
    db: REDIS_DB,
})

client.on('error', (err) => {
    console.log("Redis connection error: ", err);
})

client.on("ready", ()=>{
    console.log(`Redis connection ready on port: ${REDIS_PORT}`);
    
})

export default client;

