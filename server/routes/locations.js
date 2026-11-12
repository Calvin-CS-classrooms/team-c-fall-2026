const express = require("express");
const router = express.Router();
const { getLocations, getLocationById } = require("../services/campus-service");

// Get all locations (each with its floors and spaces)
router.get("/", async (req, res) => {
  try {
    const locations = await getLocations();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one location by ID
router.get("/:id", async (req, res) => {
  try {
    const location = await getLocationById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;