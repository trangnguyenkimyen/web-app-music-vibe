import { ClickAwayListener, Divider, Fade, IconButton, Input, InputLabel, MenuItem, MenuList, NativeSelect, Paper, Popper, Tooltip } from "@mui/material";
import "./more.scss";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseIcon from '@mui/icons-material/Close';
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { QueueContext } from "../../context/QueueContext";
import CustomSnackbar from "../customSnackbar/CustomSnackbar";
import axios from "axios";
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';

export default function More({ artists, album, songs, type, itemId, img, playlist }) {
    const [openMenu, setOpenMenu] = useState(false);
    const [openPlaylists, setOpenPlaylists] = useState(false);
    const [openArtists, setOpenArtists] = useState(false);
    const anchorMenuRef = useRef(null);
    const anchorPlaylistRef = useRef(null);
    const anchorArtistRef = useRef(null);
    const [openForm, setOpenForm] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    const [playlistType, setPlaylistType] = useState("");

    const { dispatch, user } = useContext(AuthContext);
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        if (user) {
            const list = user.playlists.filter(playlist => {
                return playlist.owner === user._id;
            })
            setPlaylists(list);
        }
    }, [user]);

    useEffect(() => {
        if (anchorPlaylistRef.current) {
            if (openPlaylists) {
                anchorPlaylistRef.current.classList.add("is-open");
            } else {
                anchorPlaylistRef.current.classList.remove("is-open");
            }
        }

        if (anchorArtistRef.current) {
            if (openArtists) {
                anchorArtistRef.current.classList.add("is-open");
            } else {
                anchorArtistRef.current.classList.remove("is-open");
            }
        }
    }, [openPlaylists, openArtists]);

    useEffect(() => {
        if (!openMenu) {
            setOpenPlaylists(false);
            setOpenArtists(false);
            setOpenForm(false);
        }
    }, [openMenu]);

    const handleListKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            setOpenMenu(false);
        } else if (e.key === 'Escape') {
            setOpenMenu(false);
        }
    };

    const handleOnClickArtists = (e) => {
        if (songs?.artists?.length === 1) {
            setOpenMenu(false)
        }
    };

    const handleMouseEnter = () => {
        setOpenPlaylists(false);
        setOpenArtists(false);
    };

    const handleMouseEnterArtists = () => {
        setOpenPlaylists(false);
        if (artists?.length > 1) {
            setOpenArtists(true);
        }
    };

    const handleMouseEnterPlaylists = () => {
        setOpenPlaylists(true);
        setOpenArtists(false);
    };

    const { currentQueue, dispatch: dispatchQueue } = useContext(QueueContext);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [msg, setMsg] = useState("");

    const handleOnClickAddToQueue = async () => {
        setOpenMenu(false);
        if (openSnackbar) {
            setOpenSnackbar(false);
        }
        setMsg("Đã thêm bài hát vào cuối hàng đợi");
        setOpenSnackbar(true);

        let updatedData = [...currentQueue?.data];
        const length = currentQueue?.initialData?.length;
        let indexData = currentQueue?.initialData[length - 1]?.index + 1;
        await songs?.forEach((value) => {
            updatedData.push({
                value: value,
                index: indexData,
                type: type,
                itemId: itemId
            });
            indexData++;
        });

        let updatedInitialData = [...currentQueue?.initialData];
        let indexInitialData = currentQueue?.initialData[length - 1]?.index + 1;
        await songs?.forEach(value => {
            updatedInitialData.push({
                value: value,
                index: indexInitialData,
                type: type,
                itemId: itemId
            });
            indexInitialData++;
        });

        let updatedInitialRandomQueue = [];
        if (currentQueue?.isShuffled) {
            updatedInitialRandomQueue = [...currentQueue?.initialRandomQueue];
            let indexRandomData = currentQueue?.initialRandomQueue[length - 1]?.index + 1;
            await songs?.forEach(value => {
                updatedInitialRandomQueue.push({
                    value: value,
                    index: indexRandomData,
                    type: type,
                    itemId: itemId
                });
                indexRandomData++;
            });
        }

        await dispatchQueue({
            type: "SET_CURRENTQUEUE", payload: {
                data: updatedData,
                initialData: updatedInitialData,
                isShuffled: currentQueue?.isShuffled,
                initialRandomQueue: updatedInitialRandomQueue,
                replayed: currentQueue?.replayed,
                isPlayed: currentQueue?.isPlayed
            }
        });
    };

    const handleOnSubmitFormPlaylist = async (e) => {
        e.preventDefault();
        try {
            const songIds = await songs.map(song => {
                return song._id;
            });

            const newPlaylist = {
                name: playlistName,
                public: playlistType === "public" ? true : false,
                images: [img],
                songs: songIds
            }

            const res = await axios.post("/playlists", newPlaylist);

            if (openSnackbar) {
                setOpenSnackbar(false);
            }

            setOpenMenu(false);
            setMsg("Đã tạo thành công playlist mới");
            setOpenSnackbar(true);

            await user.playlists.push({
                name: playlistName,
                owner: user._id,
                public: playlistType === "public" ? true : false,
                _id: res.data._id
            });

            await dispatch({
                type: "UPDATE", payload: {
                    ...user,
                    playlists: user.playlists
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleOnClickAddToPlaylist = async (playlist) => {
        try {
            const songIds = await songs.map(song => {
                return song._id;
            });
            await axios.post("/playlists/" + playlist._id + "/songs", {
                songIds: songIds
            });
            if (openSnackbar) {
                setOpenSnackbar(false);
            }
            setOpenMenu(false);
            setMsg("Đã thêm bài hát vào playlist " + playlist.name);
            setOpenSnackbar(true);
        } catch (error) {
            console.log(error);
        }
    };

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

    const handleOnClickAddToLibrary = async () => {
        try {
            if (type === "song") {
                const res = await axios.put("/me/songs/" + itemId);
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
                await axios.put("/me/albums/" + itemId);
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
                await axios.put("/me/playlists/" + itemId);
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

            setOpenMenu(false);
            setOpenSnackbar(true);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            className="more"
        >
            <div className="wrapper-more" onClick={(e) => e.stopPropagation()}>

                <ClickAwayListener onClickAway={() => setOpenMenu(false)}>
                    <Tooltip title="Xem thêm lựa chọn" disableInteractive>
                        <IconButton
                            className="button"
                            ref={anchorMenuRef}
                            id="composition-button"
                            aria-controls={openMenu ? 'composition-menu' : undefined}
                            aria-expanded={openMenu ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={(e) => { setOpenMenu(!openMenu) }}
                        >
                            <MoreVertIcon className="more-icon" />
                        </IconButton>
                    </Tooltip>
                </ClickAwayListener>

                <Popper
                    open={openMenu}
                    anchorEl={anchorMenuRef?.current}
                    role={undefined}
                    placement="top-start"
                    transition
                    disablePortal
                    className="popper-list"
                    key="popper-list"
                >
                    {({ TransitionProps, placement }) => (
                        <Fade
                            {...TransitionProps}
                            timeout={120}
                        >
                            <Paper elevation={3} className="list">
                                <MenuList
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}
                                    autoFocus={openMenu}
                                >
                                    <MenuItem
                                        className="list-item"
                                        onClick={handleOnClickAddToQueue}
                                        onMouseEnter={handleMouseEnter}
                                    >
                                        Thêm vào hàng đợi
                                    </MenuItem>
                                    {(album || artists) &&
                                        <Divider className="divider" />
                                    }
                                    {album &&
                                        <Link
                                            to={`/albums/${album?._id}`}
                                            state={{ title: album?.name }}
                                        >
                                            <MenuItem
                                                className="list-item"
                                                onClick={() => setOpenMenu(false)}
                                                onMouseEnter={handleMouseEnter}
                                            >
                                                Đến album
                                            </MenuItem>
                                        </Link>
                                    }
                                    {artists &&
                                        artists?.length === 1
                                        ?
                                        <Link
                                            to={`/artists/${artists[0]?._id}`}
                                            state={{ name: artists[0]?.name }}
                                        >
                                            <MenuItem
                                                className="list-item artist"
                                                ref={anchorArtistRef}
                                                onClick={handleOnClickArtists}
                                                onMouseEnter={handleMouseEnterArtists}
                                            >
                                                Đến nghệ sĩ
                                            </MenuItem>
                                        </Link>
                                        : artists?.length > 1 &&
                                        <MenuItem
                                            className="list-item artist"
                                            ref={anchorArtistRef}
                                            onClick={handleOnClickArtists}
                                            onMouseEnter={handleMouseEnterArtists}
                                        >
                                            Đến nghệ sĩ
                                            <PlayArrowIcon className="more-icon arrow" />
                                        </MenuItem>
                                    }

                                    {user && [
                                        <Divider className="divider" />,

                                        <MenuItem
                                            className="list-item"
                                            onClick={handleOnClickAddToLibrary}
                                            onMouseEnter={handleMouseEnter}
                                        >
                                            {liked
                                                ? "Xoá khỏi thư viện"
                                                : "Thêm vào thư viện"}
                                        </MenuItem>,

                                        <MenuItem
                                            className="list-item playlist"
                                            ref={anchorPlaylistRef}
                                            onMouseEnter={handleMouseEnterPlaylists}
                                        >
                                            Thêm vào playlist
                                            <PlayArrowIcon className="more-icon arrow" />
                                        </MenuItem>
                                    ]}
                                </MenuList>
                            </Paper>
                        </Fade>
                    )}
                </Popper>

                <Popper
                    open={openArtists}
                    anchorEl={anchorArtistRef?.current}
                    role={undefined}
                    placement="right-end"
                    transition
                    disablePortal
                    className="popper-artists"
                    key="popper-artists"
                >
                    {({ TransitionProps, placement }) => (
                        <Fade
                            {...TransitionProps}
                            timeout={120}
                        >
                            <Paper elevation={3} className="artists">
                                <MenuList
                                    onKeyDown={handleListKeyDown}
                                >
                                    {artists?.map(artist => (
                                        <Link
                                            key={artist?._id}
                                            to={`/artists/${artist?._id}`}
                                            state={{ name: artist?.name }}
                                        >
                                            <MenuItem onClick={() => setOpenMenu(false)} className="artist-item" >
                                                {artist?.name}
                                            </MenuItem>
                                        </Link>
                                    ))}
                                </MenuList>
                            </Paper>
                        </Fade>
                    )}
                </Popper>

                <Popper
                    open={openPlaylists}
                    anchorEl={anchorPlaylistRef?.current}
                    role={undefined}
                    placement="right-end"
                    transition
                    disablePortal
                    className="popper-playlists"
                    key="popper-playlists"
                >
                    {({ TransitionProps, placement }) => (
                        <Fade
                            {...TransitionProps}
                            timeout={120}
                        >
                            <Paper elevation={3} className="playlists">
                                <MenuList
                                    onKeyDown={handleListKeyDown}
                                >
                                    <div className="more-top">
                                        {playlists?.length === 0
                                            ? <p className="no-playlist">Bạn chưa có playlist nào...</p>
                                            : playlists?.map((item, index) => (
                                                <MenuItem className="playlist-item" key={item._id} onClick={() => handleOnClickAddToPlaylist(item)}>
                                                    <div className="name">
                                                        <div className="text">{item.name}</div>
                                                        <div className="icon">
                                                            <Tooltip title={item.public ? "Công khai" : "Riêng tư"} >
                                                                {item.public
                                                                    ? <PublicRoundedIcon className="more-icon public" />
                                                                    : <LockRoundedIcon className="more-icon private" />
                                                                }
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                </MenuItem>
                                            ))
                                        }
                                    </div>
                                    <div className="more-bottom">
                                        <Divider className="divider" />
                                        <MenuItem
                                            className="playlist-item"
                                            onClick={() => setOpenForm(!openForm)}
                                        >
                                            {openForm
                                                ? <CloseIcon className="more-icon close" />
                                                : <AddRoundedIcon className="more-icon add" />}
                                            Tạo playlist mới
                                        </MenuItem>

                                        <form className={`form-create-playlist ${openForm}`} onSubmit={handleOnSubmitFormPlaylist}>
                                            <div className="form-group">
                                                <InputLabel variant="standard" htmlFor="playlist-name" className="form-label">
                                                    Tên:
                                                </InputLabel>
                                                <Input
                                                    id="playlist-name"
                                                    className="form-input name"
                                                    required
                                                    value={playlistName}
                                                    onChange={(e) => setPlaylistName(e.target.value)}
                                                    inputProps={{ maxLength: 50 }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <InputLabel variant="standard" htmlFor="playlist-type" className="form-label">
                                                    Quyền riêng tư:
                                                </InputLabel>
                                                <NativeSelect
                                                    inputProps={{
                                                        name: 'type',
                                                        id: "playlist-type"
                                                    }}
                                                    className="form-input type"
                                                    value={playlistType}
                                                    onChange={(e) => setPlaylistType(e.target.value)}
                                                >
                                                    <option value="private" id="private">Riêng tư</option>
                                                    <option value="public" id="public">Công khai</option>
                                                </NativeSelect>
                                            </div>
                                            <div className="wrapper-button">
                                                <button disabled={playlistName ? false : true}>Tạo</button>
                                            </div>
                                        </form>
                                    </div>
                                </MenuList>
                            </Paper>
                        </Fade>
                    )}
                </Popper>
            </div>

            <CustomSnackbar
                openSnackbar={openSnackbar}
                setOpenSnackbar={setOpenSnackbar}
                message={msg}
            />
        </div>
    )
}
