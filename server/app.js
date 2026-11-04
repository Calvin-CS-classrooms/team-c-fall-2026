// Sets up the Express application, enables CORS, and connects the API routes for retrieving campus locations
const express = require("express");
const cors = require("cors");
const locationsRouter = require("./routes/locations");

const app = express();

app.use(cors({
  origin: "http://localhost:8081"
}));

app.use(express.json());

app.use("/api/locations", locationsRouter);

module.exports = app;