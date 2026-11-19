// Account routes. HTTP only: the rules live in services/auth-service.js.
const express = require("express");
const router = express.Router();
const { createAccount } = require("../services/auth-service");

// Create an account and email a confirmation link.
// Body: { firstName, lastName?, email, password }
router.post("/signup", async (req, res) => {
  try {
    const { email } = await createAccount(req.body);
    res.status(201).json({
      email,
      message: `Check ${email} for a link to confirm your account.`,
    });
  } catch (err) {
    if (err.status && err.name === "AppError") {
      return res.status(err.status).json(err.field ? { error: err.message, field: err.field } : { error: err.message });
    }
    res.status(500).json({ error: "Something went wrong creating your account. Please try again." });
  }
});

module.exports = router;
