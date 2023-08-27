const { searchForItems } = require("../controllers/search");
const validLimit = require("../utils/validLimit");

const router = require("express").Router();

// Search for items
router.get("/", validLimit, searchForItems);

module.exports = router;