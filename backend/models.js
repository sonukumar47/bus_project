// models.js
const mongoose = require("mongoose");

const StopSchema = new mongoose.Schema({
  name: String, lat: Number, lon: Number, sequence: Number
});

const RouteSchema = new mongoose.Schema({
  name: String, stops: [StopSchema]
});

const BusSchema = new mongoose.Schema({
  registrationNumber: String, routeId: String
});

const PositionSchema = new mongoose.Schema({
  busId: String, lat: Number, lon: Number,
  speed: Number, heading: Number,
  timestamp: { type: Date, default: Date.now }
});

const Route = mongoose.model("Route", RouteSchema);
const Bus = mongoose.model("Bus", BusSchema);
const Position = mongoose.model("Position", PositionSchema);

module.exports = { Route, Bus, Position };