/**
 * This file connects us with Redis server
 * Creates a new redis client as an object
 * Exports the client object 
 */
import Redis from "ioredis";
import { REDIS_PORT, REDIS_HOSTNAME, REDIS_DB, REDIS_URL} from "../utils/helper.js";

// console.log(REDIS_PORT);

export const client = new Redis(
    REDIS_URL
//     {
//     port: REDIS_PORT,
//     host: REDIS_HOSTNAME,
//     db: REDIS_DB,
// }
)

client.on('error', (err) => {
    console.log("Redis connection error: ", err);
})

client.on("ready", ()=>{
    console.log(`Redis connection ready on port: ${REDIS_PORT}`);
    
})


export const subscriberClient = new Redis(
    REDIS_URL
//     {
//     port: REDIS_PORT,
//     host: REDIS_HOSTNAME,
//     db: REDIS_DB,
// }
)

subscriberClient.on('error', (err) => {
    console.log("subscriberClient Redis connection error: ", err);
})

subscriberClient.on("ready", ()=>{
    console.log(`subscriberClient Redis connection ready on port: ${REDIS_PORT}`);
    
})


export default { client, subscriberClient };