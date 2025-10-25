// index.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const { Route, Bus, Position } = require("./models");

// ✅ Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/bustracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err.message));

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ✅ Health check
app.get("/", (req, res) => {
  res.send({ ok: true });
});

// ✅ Create a new route
app.post("/routes", async (req, res) => {
  const route = await Route.create(req.body);
  res.json(route);
});

// ✅ Get a route by ID
app.get("/routes/:id", async (req, res) => {
  const route = await Route.findById(req.params.id);
  res.json(route);
});

// ✅ Create or update a bus (using custom `id`)
app.post("/buses", async (req, res) => {
  const { id, registrationNumber, routeId } = req.body;
  const bus = await Bus.findOneAndUpdate(
    { id },
    { registrationNumber, routeId },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json(bus);
});

// ✅ Receive GPS updates
app.post("/positions", async (req, res) => {
  try {
    const { busId, lat, lon, speed = 0, heading = 0 } = req.body;
    const position = await Position.create({ busId, lat, lon, speed, heading });
    io.emit("position", {
      busId,
      lat,
      lon,
      speed,
      heading,
      timestamp: position.timestamp
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Error in /positions:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get latest positions for all buses
app.get("/positions/latest", async (_req, res) => {
  const buses = await Bus.find({});
  const latest = await Promise.all(
    buses.map(async (b) => {
      const p = await Position.findOne({ busId: b.id }).sort({ timestamp: -1 });
      return p ? {
        busId: b.id,
        lat: p.lat,
        lon: p.lon,
        timestamp: p.timestamp
      } : null;
    })
  );
  res.json(latest.filter(Boolean));
});

// ✅ Start server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});