const express = require("express");
const router = express.Router();
const {
  getFavoritesByUserId,
  createFavorite,
  deleteFavorite,
} = require("../services/campus-service");

// Get favorites for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const favorites = await getFavoritesByUserId(req.params.userId);
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a favorite
router.post("/", async (req, res) => {
  try {
    const favorite = await createFavorite(req.body);
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a favorite
router.delete("/:userId/:spaceId", async (req, res) => {
  try {
    await deleteFavorite(req.params.userId, req.params.spaceId);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
