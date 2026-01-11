/**
 * This file will instantiate our express app
 */
import { PORT } from "../utils/helper.js";
import express from "express";
import client from "../adapters/redisClient.js";
// dotenv.config("../../.env")

const app = express();

client.set("CHECK", "REDIS STORING DATA");

client.get("CHECK", (err, val) => {
    if(err) {
        throw new Error("Error fetchinf value from Redis: ", err);
    }
    console.log(val);
})

app.get('/health', (req, res) => {
    res.send({
        status: 200,
        message: "Status OK"
    })
})

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
})