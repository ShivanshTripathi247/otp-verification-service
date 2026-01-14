/**
 * This file will instantiate our express app
 */
import { PORT } from "../utils/helper.js";
import express from "express";
import client from "../adapters/redisClient.js";
import { generateOtp, verifyOtp } from "./routes.js";

// dotenv.config("../../.env")

const app = express();
app.use(express.json())

app.use("/api/v1", generateOtp);
app.use("/api/v1", verifyOtp);

client.set("CHECK", "REDIS STORING DATA");

client.get("CHECK", (err, val) => {
    if(err) {
        throw new Error("Error fetching value from Redis: ", err);
    }
    console.log(val);
})

app.get('/health', (req, res) => {
    console.log("GET Health request");
    
    res.send({
        status: 200,
        message: "Status OK"
    })
})

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
})