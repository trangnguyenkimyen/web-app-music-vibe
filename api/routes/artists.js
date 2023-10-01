const { createArtist, deleteArtist, updateArtist, getArtist, getAllArtists, getArtistAlbum, getArtistTopSongs, getRelatedArtists, getPopularArtists } = require("../controllers/artist");
const validLimit = require("../utils/validLimit");
const validObjectId = require("../utils/validObjectId");
const { verifyUser, verifyToken, verifyAdmin } = require("../utils/verifyToken");

const router = require("express").Router();

// Create an artist
router.post("/", verifyAdmin, createArtist);

// Update an artist by id
router.put("/:id", [validObjectId, verifyAdmin], updateArtist);

// Delete an artist
router.delete("/:id", [validObjectId, verifyAdmin], deleteArtist);

// Get an artist by id
router.get("/find/:id", validObjectId, getArtist);
// Get all artists
router.get("/", getAllArtists);
// Get artist's albums
router.get("/:id/albums", validObjectId, getArtistAlbum);
// Get artist's top songs
router.get("/:id/top-songs", validObjectId, getArtistTopSongs);
// Get artist's related artists
router.get("/:id/related-artists", [validLimit, validObjectId], getRelatedArtists);
// Get popular artists
router.get("/top/popular", validLimit, getPopularArtists);

module.exports = router;