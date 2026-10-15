const express = require("express");
const router = express.Router();
const locations = require("../data/locations");

// Get all locations
router.get("/", (req, res) => {
  res.json(locations);
});

// Get one location by ID
router.get("/:id", (req, res) => {
  const location = locations.find(
    loc => loc.id === req.params.id
  );

  if (!location) {
    return res.status(404).json({
      error: "Location not found"
    });
  }

  res.json(location);
});

module.exports = router;