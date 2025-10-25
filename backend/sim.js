const axios = require("axios");

const BUS_ID = "bus-1";
let lat = 12.9716;
let lon = 77.5946;
let heading = 90;
let speed = 10;

function move() {
  // Simulate movement eastward
  lon += 0.0005;

  axios.post("http://localhost:4000/positions", {
    busId: BUS_ID,
    lat,
    lon,
    speed,
    heading
  })
  .then(() => console.log(`📍 Sent position: ${lat.toFixed(4)}, ${lon.toFixed(4)}`))
  .catch((err) => console.error("❌ Error sending position:", err.message));
}

setInterval(move, 3000); // every 3 seconds