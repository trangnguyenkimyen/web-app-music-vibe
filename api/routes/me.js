const { getPlaylists, getProfile, getTopItems, getFollowedArtists,
    followPlaylist, followArtistUser, getLikedPlaylists, getLikedSongs,
    likeSong, getCurrentlyPlayed, addCurrentlyPlayed, getRecommendedArtists, getRecommendedSongs, likeAlbum, getLikedAlbums } = require("../controllers/me");
const validLimit = require("../utils/validLimit");
const validObjectId = require("../utils/validObjectId");
const { verifyUser } = require("../utils/verifyToken");

const router = require("express").Router();

// Follow/Unfollow playlist
router.put("/playlists/:id", [validObjectId, verifyUser], followPlaylist);
// Follow/Unfollow artist/user
router.put("/following/:id", verifyUser, followArtistUser);
// Like Song
router.put("/songs/:id", [validObjectId, verifyUser], likeSong);
// Like Album
router.put("/albums/:id", [validObjectId, verifyUser], likeAlbum);
// Add currently-played
router.put("/currently-played/:id", [validObjectId, verifyUser], addCurrentlyPlayed);

// Get current user’s profile
router.get("/", verifyUser, getProfile);
// Get current user’s playlists
router.get("/playlists", [validLimit, verifyUser], getPlaylists);
// Get user’s top items
router.get("/top/:type", [validLimit, verifyUser], getTopItems);
// Get followed artists/users
router.get("/following", [validLimit, verifyUser], getFollowedArtists);
// Get user's liked playlists
router.get("/liked-playlists", [validLimit, verifyUser], getLikedPlaylists);
// Get user's liked songs
router.get("/liked-songs", [validLimit, verifyUser], getLikedSongs);
// Get user's liked albums
router.get("/liked-albums", [validLimit, verifyUser], getLikedAlbums);
// Get user's currently played
router.get("/currently-played", [validLimit, verifyUser], getCurrentlyPlayed);
// Get recommended artists
router.get("/recommended-artists", [validLimit, verifyUser], getRecommendedArtists);
// Get recommended songs
router.get("/recommended-songs", [validLimit, verifyUser], getRecommendedSongs);

module.exports = router;