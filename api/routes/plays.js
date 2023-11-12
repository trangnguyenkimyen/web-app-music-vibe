const { createPlays } = require("../controllers/plays");
const { verifyUser } = require("../utils/verifyToken");

const router = require("express").Router();

// Create a plays
router.post("/", verifyUser, createPlays);

module.exports = router;
