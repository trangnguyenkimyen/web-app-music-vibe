const { createAlbum, updateAlbum, deleteAlbum, getAlbum, getAllAlbums, getAlbumSongs, getPopularAlbums } = require("../controllers/album");
const validLimit = require("../utils/validLimit");
const validObjectId = require("../utils/validObjectId");
const { verifyUser, verifyAdmin, verifyToken } = require("../utils/verifyToken");

const router = require("express").Router();

// Create an album
router.post("/", verifyAdmin, createAlbum);

// Update album by id
router.put("/:id", [validObjectId, verifyAdmin], updateAlbum);

// Delete album by id
router.delete("/:id", [validObjectId, verifyAdmin], deleteAlbum);

// Get album by id
router.get("/find/:id", validObjectId, getAlbum);
// Get all albums
router.get("/", getAllAlbums);
// Get album's songs
router.get("/:id/songs", [validObjectId, validLimit], getAlbumSongs);
// Get popular albums
router.get("/top/popular", validLimit, getPopularAlbums);

module.exports = router;