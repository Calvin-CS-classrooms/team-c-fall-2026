const express = require("express");
const router = express.Router();
const { getAmenities, getCategories } = require("../services/campus-service");

// Get all amenities
router.get("/amenities", async (req, res) => {
  try {
    const amenities = await getAmenities();
    res.json(amenities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
