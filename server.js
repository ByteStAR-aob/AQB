// ===== BlueComet ByteStar v2 Server with Socket.IO =====
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = express();
const PORT = 5000;

// ===== MIDDLEWARE =====
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, "public"))); // fixed

// ===== HTTP ROUTES =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/dashboard.html"));
});

// ===== Optional /message POST route =====
app.post("/message", (req, res) => {
  try {
    const { text } = req.body || {};
    console.log("User said (POST):", text);

    const reply = `Echo: ${text ?? ""}`;
    return res.json({ ok: true, reply });
  } catch (err) {
    console.error("Error in /message:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ===== SOCKET.IO SETUP =====
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chatMessage", (msg) => {
    console.log("User said (Socket.IO):", msg);
    io.emit("chatMessage", msg); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// ===== START SERVER =====
server.listen(PORT, "0.0.0.0", () => {
  const os = require("os");
  const networkInterfaces = os.networkInterfaces();
  let localIP = "localhost";

  for (const iface of Object.values(networkInterfaces)) {
    for (const alias of iface) {
      if (alias.family === "IPv4" && !alias.internal) {
        localIP = alias.address;
      }
    }
  }

  console.log("🚀 BlueComet ByteStar v2 Live Chat running!");
  console.log(`🌐 Local: http://localhost:${PORT}/dashboard.html`);
  console.log(`🌐 Network: http://${localIP}:${PORT}/dashboard.html`);
});
