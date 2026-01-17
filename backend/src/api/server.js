/**
 * This file will instantiate our express app
 */
import { FRONTEND_URL, PORT, SOCKET_PORT } from "../utils/helper.js";
import express from "express";
import { client, subscriberClient } from "../adapters/redisClient.js";
import { generateOtp, verifyOtp } from "./routes.js";
import { Server } from "socket.io";
import { randomUUID } from "crypto";
import { createServer } from "http";
import cors from 'cors';

// dotenv.config("../../.env")

const app = express();
app.use(express.json());
app.use(cors({
    origin: FRONTEND_URL,
    methods: [ 'POST' ]
}))


const httpServer = createServer(app);
export const io = new Server(httpServer, {
    // options
    cors: { 
        origin: FRONTEND_URL,
        methods: [ 'POST' ]
     }
})

io.on('connection', (socket) => {
    console.log("New client connected: ", socket.id);
    
    socket.on("join_job", (jobId) => {
        if(!jobId) return;
        console.log(`Socket ${socket.id} joined room ${jobId}.`);
        socket.join(jobId);
        socket.emit("room_joined", {jobId: jobId, message: "Tracking started"});
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected!");
    })
});

subscriberClient.subscribe("task_updates", (err, count) => {
    if(err) console.log("Failed to subscribe: ", err);
    else console.log(`Subscribe to ${count} redis channel`);
})

subscriberClient.on('message', (channel, message) => {
    try {
        const data = JSON.parse(message);
        console.log(`Forwarding update for ${data.jobId}, status: ${data.status}`);
        io.to(data.jobId).emit("progress_update", data);
    } catch (err) {
        throw new Error("Error forwarding update: ",err);
    }
})


httpServer.listen(PORT, ()=>{
    console.log("Listening on port: ", PORT);
    
});

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

