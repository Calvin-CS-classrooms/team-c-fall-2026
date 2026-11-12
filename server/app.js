// Sets up the Express application, enables CORS, and connects the API routes for retrieving campus locations
const express = require("express");
const cors = require("cors");
const locationsRouter = require("./routes/locations");
const spacesRouter = require("./routes/spaces");
const ratingsRouter = require("./routes/ratings");
const favoritesRouter = require("./routes/favorites");
const referenceRouter = require("./routes/reference");
const notificationsRouter = require("./routes/notifications");

const app = express();

app.use(cors({
  origin: "http://localhost:8081"
}));

app.use(express.json());

app.use("/api/locations", locationsRouter);
app.use("/api/spaces", spacesRouter);
app.use("/api/ratings", ratingsRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/reference", referenceRouter);
app.use("/api/notifications", notificationsRouter);

module.exports = app;