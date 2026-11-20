const express = require("express");
const router = express.Router();
const { getUserByEmail } = require("../services/campus-service");

// Get a user by email (used to validate sign-in against the database)
router.get("/by-email/:email", async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
