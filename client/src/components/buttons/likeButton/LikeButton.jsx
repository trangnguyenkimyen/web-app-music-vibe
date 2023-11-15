import "./likeButton.scss";
import { Tooltip } from "@mui/material";
import { withStyles } from "@mui/styles";
import { useContext, useEffect, useRef, useState } from "react";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LoginPopover from "../../loginPopover/LoginPopover";
import axios from "axios";
import CustomSnackbar from "../../customSnackbar/CustomSnackbar";
import { AuthContext } from "../../../context/AuthContext";

export default function LikeButton({ custom, type, itemId, playlist }) {
    const CustomTooltip = withStyles(theme => ({
        tooltip: {
            zIndex: -1,
        },
    }))(Tooltip);

    const anchorRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [msg, setMsg] = useState("");
    const { dispatch, user } = useContext(AuthContext);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (user) {
            if (type === "song") {
                if (user.likedSongs.includes(itemId)) {
                    return setLiked(true);
                } else {
                    return setLiked(false);
                }
            }
            if (type === "album") {
                if (user.albums.includes(itemId)) {
                    return setLiked(true);
                } else {
                    return setLiked(false);
                }
            }
            if (type === "playlist") {
                user.playlists.forEach(item => {
                    if (item._id === itemId) {
                        return setLiked(true);
                    } else {
                        return setLiked(false);
                    }
                })
            }
        } else {
            return setLiked(false);
        }
    }, [user, itemId, type]);

    const handleOnClickLike = async () => {
        if (user) {
            try {
                if (type === "song") {
                    const res = await axios.put(process.env.REACT_APP_API_URL + "/me/songs/" + itemId, null, { withCredentials: true });
                    if (res.data === "Song unliked") {
                        const updatedLikedSongs = await user.likedSongs.filter(id => {
                            return id !== itemId;
                        });
                        await dispatch({
                            type: "UPDATE", payload: {
                                ...user,
                                likedSongs: updatedLikedSongs
                            }
                        });
                        setMsg("Đã xoá bài hát khỏi thư viện");
                    } else {
                        await user.likedSongs.push(itemId);
                        await dispatch({
                            type: "UPDATE", payload: {
                                ...user,
                                likedSongs: user.likedSongs
                            }
                        });
                        setMsg("Đã thêm bài hát vào thư viện");
                    }
                } else if (type === "album") {
                    await axios.put(process.env.REACT_APP_API_URL + "/me/albums/" + itemId, null, { withCredentials: true });
                    if (liked) {
                        const updatedLikedAlbums = await user.albums.filter(id => {
                            return id !== itemId;
                        });
                        await dispatch({
                            type: "UPDATE", payload: {
                                ...user,
                                albums: updatedLikedAlbums
                            }
                        });
                        setMsg("Đã xóa album khỏi thư viện");
                    } else {
                        await user.albums.push(itemId);
                        await dispatch({
                            type: "UPDATE", payload: {
                                ...user,
                                albums: user.albums
                            }
                        });
                        setMsg("Đã thêm album vào thư viện");
                    }
                } else if (type === "playlist") {
                    await axios.put(process.env.REACT_APP_API_URL + "/me/playlists/" + itemId, null, { withCredentials: true });
                    if (liked) {
                        const updatedLikedPlaylists = await user.playlists.filter(item => {
                            return item._id !== itemId;
                        });
                        await dispatch({
                            type: "UPDATE", payload: {
                                ...user,
                                playlists: updatedLikedPlaylists
                            }
                        });
                        setMsg("Đã xóa playlist khỏi thư viện");
                    } else {
                        await user.playlists.push({
                            _id: itemId,
                            name: playlist.name,
                            public: playlist.public,
                            owner: playlist.owner
                        });
                        await dispatch({
                            type: "UPDATE", payload: {
                                ...user,
                                playlists: user.playlists
                            }
                        });
                        setMsg("Đã thêm playlist vào thư viện");
                    }
                }
                if (openSnackbar) {
                    setOpenSnackbar(false);
                }

                await setOpenSnackbar(true);
                // setLiked(!liked);
            } catch (error) {
                console.log(error);
            }
        } else {
            setOpen(true);
        }
    };

    return (
        <div className="like-btn" >
            <div className="wrapper-like-btn" onClick={handleOnClickLike} ref={anchorRef}>
                {!custom
                    ?
                    <Tooltip title={liked ? "Xóa khỏi thư viện" : "Thêm vào thư viện"} disableInteractive>
                        {liked
                            ? <FavoriteIcon
                                className="icon unliked"
                            />
                            : <FavoriteBorderOutlinedIcon
                                className="icon liked"
                            />}
                    </Tooltip>
                    :
                    <CustomTooltip title={liked ? "Xóa khỏi thư viện" : "Thêm vào thư viện"} disableInteractive>
                        {liked
                            ? <FavoriteIcon
                                className="icon unliked"
                            />
                            : <FavoriteBorderOutlinedIcon
                                className="icon liked"
                            />}
                    </CustomTooltip>
                }
            </div>
            <LoginPopover
                open={open}
                setOpen={setOpen}
                anchorEl={anchorRef?.current}
                title="Thêm vào thư viện"
                content="Hãy đăng nhập để tạo không gian âm nhạc của riêng bạn."
            />
            <CustomSnackbar
                openSnackbar={openSnackbar}
                setOpenSnackbar={setOpenSnackbar}
                message={msg}
            />
        </div>
    )
}
