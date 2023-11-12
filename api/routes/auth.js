const { login, register, verifyEmail, resetPass, verifyPass } = require("../controllers/auth");
const router = require("express").Router();

// POST
router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPass);

// GET
router.get("/verify/:token", verifyEmail);
router.get("/reset-password/:token", verifyPass);

module.exports = router;