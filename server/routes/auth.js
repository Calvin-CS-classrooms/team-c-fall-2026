// Account routes. HTTP only: the rules live in services/auth-service.js.
const express = require("express");
const router = express.Router();
const { createAccount } = require("../services/auth-service");

// Create an account. Emails a confirmation link once real sign-up is switched on.
// Body: { firstName, lastName?, email, password }
router.post("/signup", async (req, res) => {
  try {
    const { email, emailSent } = await createAccount(req.body);
    res.status(201).json({
      email,
      emailSent,
      message: emailSent
        ? `Check ${email} for a link to confirm your account.`
        : `Account created for ${email}. No email was sent: sign-up is in mock mode for now.`,
    });
  } catch (err) {
    if (err.status && err.name === "AppError") {
      return res.status(err.status).json(err.field ? { error: err.message, field: err.field } : { error: err.message });
    }
    res.status(500).json({ error: "Something went wrong creating your account. Please try again." });
  }
});

module.exports = router;
