const express = require("express");
const router = express.Router();
const { getFavoritesByUserId } = require("../services/campus-service");

// Get favorites for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const favorites = await getFavoritesByUserId(req.params.userId);
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
