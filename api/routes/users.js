const { updateUser, getUser, getAllUsers, deleteUser, getPlaylists } = require("../controllers/user");
const validLimit = require("../utils/validLimit");
const validObjectId = require("../utils/validObjectId");
const { verifyUser, verifyToken, verifyAdmin } = require("../utils/verifyToken");

const router = require("express").Router();

// Update a user by id
router.put("/:id", [validObjectId, verifyUser], updateUser);

// Delete a user by id
router.delete("/:id", [validObjectId, verifyUser], deleteUser);

// Get a user by id
router.get("/find/:id", [validObjectId, verifyToken], getUser);
// Get all users
router.get("/", [validLimit, verifyAdmin], getAllUsers);
// Get user's playlists (public)
router.get("/:id/playlists", [validObjectId, validLimit, verifyToken], getPlaylists);

module.exports = router;