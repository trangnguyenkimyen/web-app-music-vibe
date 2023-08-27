const { createSong, getSong, updateSong, getAllSongs, deleteSong } = require("../controllers/song");
const validLimit = require("../utils/validLimit");
const validObjectId = require("../utils/validObjectId");
const { verifyUser, verifyToken, verifyAdmin } = require("../utils/verifyToken");

const router = require("express").Router();

// Create a song
router.post("/", verifyAdmin, createSong);

// Update a song by id
router.put("/:id", [validObjectId, verifyAdmin], updateSong);

// Get a song by id
router.get("/find/:id", validObjectId, getSong);
// Get all songs
router.get("/", validLimit, getAllSongs);
// Delete a song by id
router.delete("/:id", [validObjectId, verifyAdmin], deleteSong);

module.exports = router;