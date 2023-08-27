const { login, register } = require("../controllers/auth");
const router = require("express").Router();

// POST
router.post("/register", register);
router.post("/login", login);

module.exports = router;