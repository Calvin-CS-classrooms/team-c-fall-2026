const express = require("express");
const router = express.Router();
const { getSpaces, getSpaceById, getSpacesByLocationId } = require("../services/campus-service");

// Get all spaces (enriched with derived rating metrics)
router.get("/", async (req, res) => {
  try {
    const spaces = await getSpaces();
    res.json(spaces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get spaces for a location
router.get("/location/:locationId", async (req, res) => {
  try {
    const spaces = await getSpacesByLocationId(req.params.locationId);
    res.json(spaces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one space by ID
router.get("/:id", async (req, res) => {
  try {
    const space = await getSpaceById(req.params.id);
    if (!space) {
      return res.status(404).json({ error: "Space not found" });
    }
    res.json(space);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
