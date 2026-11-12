const express = require("express");
const router = express.Router();
const { getRatings, getRatingsBySpaceId } = require("../services/campus-service");

// Get all ratings
router.get("/", async (req, res) => {
  try {
    const ratings = await getRatings();
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get ratings for a space
router.get("/space/:spaceId", async (req, res) => {
  try {
    const ratings = await getRatingsBySpaceId(req.params.spaceId);
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
