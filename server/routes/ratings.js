const express = require("express");
const router = express.Router();
const {
  getRatings,
  getRatingsBySpaceId,
  createRating,
  deleteRating,
} = require("../services/campus-service");

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

// Create a rating
router.post("/", async (req, res) => {
  try {
    const rating = await createRating(req.body);
    res.status(201).json(rating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a rating
router.delete("/:id", async (req, res) => {
  try {
    await deleteRating(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
