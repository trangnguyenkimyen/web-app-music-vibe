const { updateUser, getUser, getAllUsers, deleteUser, getPlaylists, resetPassword, logout, existUser } = require("../controllers/user");
const validLimit = require("../utils/validLimit");
const validObjectId = require("../utils/validObjectId");
const { verifyUser, verifyToken, verifyAdmin } = require("../utils/verifyToken");

const router = require("express").Router();

// Update a user by id
router.put("/:id", [validObjectId, verifyUser], updateUser);
// Reset password by email
router.put("/reset-pass/:email", resetPassword);

// Delete a user by id
router.delete("/:id", [validObjectId, verifyUser], deleteUser);

// Get a user by id
router.get("/find/:id", [validObjectId, verifyToken], getUser);
// Get a user by email
router.get("/exist/:email", existUser);
// Get all users
router.get("/", [validLimit, verifyAdmin], getAllUsers);
// Get user's playlists (public)
router.get("/:id/playlists", [validObjectId, validLimit, verifyToken], getPlaylists);
// Logout
router.get("/logout", verifyUser, logout);

module.exports = router;