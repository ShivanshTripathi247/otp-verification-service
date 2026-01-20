import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

// CHANGE THESE TO MATCH YOUR BACKEND PORTS
const API_URL = process.env.REACT_APP_API_URL; 
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL; 

      console.log(SOCKET_URL," ",API_URL);

function App() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState();
  const [jobId, setJobId] = useState(null);
  
  // Stages: 0=Idle, 1=Queued, 2=Processing, 3=Generated, 4=Sent, 5=Verifying, 6=Verified
  const [currentStage, setCurrentStage] = useState(0);
  const [logs, setLogs] = useState([]);
  const [statusMessage, setStatusMessage] = useState("Waiting for input...");
  
  const socketRef = useRef();

  // 1. Initialize Socket Connection
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    // Listen for updates from the "Bridge"
    socketRef.current.on("progress_update", (data) => {
      addLog(`[UPDATE] Update: ${data.status} (Stage ${data.stage})`);
      setCurrentStage(data.stage);
      setStatusMessage(data.status);
    });

    socketRef.current.on("room_joined", (data) => {
      addLog(`[CONNECTED] Connected to Job Room: ${data.jobId}`);
    });

    return () => socketRef.current.disconnect();
  }, []);

  const addLog = (msg) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  // 2. Handle Send OTP
  const handleSend = async () => {
    if (!email) return alert("Please enter an email");
    
    try {
      addLog(`[SEND] Sending request for ${email}...`);
      console.log(SOCKET_URL," ",API_URL);
      
      // Call the API
      const res = await axios.post(`${API_URL}/generate`, { email });
      
      const newJobId = res.data.jobId;
      setJobId(newJobId);
      addLog(`[ID] Job ID received: ${newJobId}`);
      setCurrentStage(1); // Manually set stage 1 (Queued)
      setStatusMessage("Request Queued");

      // JOIN THE SOCKET ROOM IMMEDIATELY
      socketRef.current.emit("join_job", newJobId);

    } catch (err) {
      console.error(err);
      addLog(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  // 3. Handle Verify OTP
  const handleVerify = async () => {
    if (!otp) return alert("Please enter OTP");
    
    try {
      addLog(`[VERIFICATION] Verifying OTP: ${otp}...`);
      
      // We must send jobId so backend knows which Room to notify!
      const res = await axios.post(`${API_URL}/verify`, { 
        email, 
        code: otp, 
        jobId: jobId 
      });

      addLog(`Result: ${res.data.message}`);
    } catch (err) {
      console.error(err);
      addLog(`[VERIFICATION] Verification Failed: ${err.response?.data?.message}`);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Distributed OTP Verification Service</h1>

        {/* --- STAGE VISUALIZER --- */}
        <div className="stepper">
          {[1, 2, 3, 4, 6].map((step) => (
            <div 
              key={step} 
              className={`step ${currentStage >= step ? 'completed' : ''} ${currentStage === step ? 'active' : ''}`}
            >
              <div className="circle">
                {currentStage > step ? '✓' : step}
              </div>
              <span className="label">
                {step === 1 && "Queued"}
                {step === 2 && "Processing"}
                {step === 3 && "Generated"}
                {step === 4 && "Sent"}
                {step === 6 && "Verified"}
              </span>
            </div>
          ))}
        </div>

        <div className="status-bar">
          Status: <strong>{statusMessage}</strong>
        </div>

        {/* --- INPUT FORMS --- */}
        <div className="form-group">
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={currentStage > 0} 
          />
          <button onClick={handleSend} disabled={currentStage > 0}>
            Send OTP
          </button>
        </div>

        {currentStage >= 4 && (
          <div className="form-group slide-in">
            <input 
              type="number" 
              placeholder="Enter 6-digit Code" 
              value={otp || ""}
              onChange={(e) => setOtp(e.target.value === "" ? "" : Number(e.target.value))}
            />
            <button className="verify-btn" onClick={handleVerify}>
              Verify Code
            </button>
          </div>
        )}

        {/* --- LOG CONSOLE --- */}
        <div className="console">
          <h3>System Logs</h3>
          <div className="logs-window">
            {logs.map((log, index) => (
              <div key={index} className="log-line">{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;