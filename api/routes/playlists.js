const { createPlaylist, updatePlaylist, deletePlaylist, getPlaylist, getAllPlaylists, getPlaylistSongs } = require("../controllers/playlist");
const validLimit = require("../utils/validLimit");
const validObjectId = require("../utils/validObjectId");
const { verifyUser, verifyToken, verifyAdmin } = require("../utils/verifyToken");

const router = require("express").Router();

// Create playlist
router.post("/", verifyUser, createPlaylist);

// Updated playlist by id
router.put("/:id", [validObjectId, verifyUser], updatePlaylist);

// Delete playlist by id
router.delete("/:id", [validObjectId, verifyUser], deletePlaylist);

// Get playlist by id
router.get("/find/:id", validObjectId, getPlaylist);
// Get all playlists
router.get("/", validLimit, getAllPlaylists);
// Get playlist's songs
router.get("/:id/songs", validObjectId, getPlaylistSongs);


module.exports = router;