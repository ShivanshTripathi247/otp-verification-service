/**
 * This file loads the environment variables
 * stores them in variable 
 * and export them to that whole workspace
 */
import dotenv from 'dotenv';
import path from 'path';

// 1. Force dotenv to look in the root directory (./.env)
// path.resolve() creates an absolute path to the file
const envPath = path.resolve(process.cwd(), '.env');

// 2. Load the config with the specific path
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error("Can't find .env file at:", envPath);
}

// 3. Export the variables
const PORT = process.env.PORT;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_HOSTNAME = process.env.REDIS_HOSTNAME || '127.0.0.1';const REDIS_DB = process.env.REDIS_DB;
const REDIS_URL = process.env.REDIS_URL
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL = process.env.EMAIL;
const SOCKET_PORT = process.env.SOCKET_PORT;

// Debug: Check if it loaded (Remove this line after fixing!)
console.log("DEBUG Config Loaded: SMTP_HOST =", SMTP_HOST); 

export {
    PORT,
    REDIS_PORT,
    REDIS_HOSTNAME,
    REDIS_DB,
    REDIS_URL,
    SOCKET_PORT,
    FRONTEND_URL,
    SMTP_HOST,
    SMTP_PASS,
    SMTP_PORT,
    SMTP_USER,
    EMAIL
};