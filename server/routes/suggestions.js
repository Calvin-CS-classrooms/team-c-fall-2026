const express = require("express");
const router = express.Router();
const { createSpotSuggestion } = require("../services/campus-service");

// Create a spot suggestion
router.post("/", async (req, res) => {
  try {
    const suggestion = await createSpotSuggestion(req.body);
    res.status(201).json(suggestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
