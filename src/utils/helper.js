/**
 * This file loads the environment variables
 * stores them in variable 
 * and export them to that whole workspace
 */
import 'dotenv/config';

const PORT = process.env.PORT;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_HOSTNAME = process.env.REDIS_HOSTNAME;
const REDIS_DB = process.env.REDIS_DB;
  

export {
    PORT,
    REDIS_PORT,
    REDIS_HOSTNAME,
    REDIS_DB,
};
    
    