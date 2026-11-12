const express = require("express");
const router = express.Router();
const { getNotificationsByUserId } = require("../services/campus-service");

// Get notifications for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const notifications = await getNotificationsByUserId(req.params.userId);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
