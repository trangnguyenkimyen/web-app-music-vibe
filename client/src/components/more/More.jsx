import { Checkbox, ClickAwayListener, Divider, Fade, FormControlLabel, IconButton, Input, InputLabel, MenuItem, MenuList, NativeSelect, Paper, Popper, Tooltip } from "@mui/material";
import "./more.scss";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useRef, useState } from "react";

export default function More() {
    const [openMenu, setOpenMenu] = useState(false);
    const [openPlaylists, setOpenPlaylists] = useState(false);
    const anchorMenuRef = useRef(null);
    const anchorPlaylistRef = useRef(null);
    const [curPlaylist, setCurPlaylist] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    const [playlistType, setPlaylistType] = useState("");

    useEffect(() => {
        if (anchorPlaylistRef.current) {
            if (openPlaylists) {
                anchorPlaylistRef.current.classList.add("is-open");
            } else {
                anchorPlaylistRef.current.classList.remove("is-open");
            }
        }
    }, [openPlaylists]);

    const handleToggle = () => {
        setOpenMenu(!openMenu);
        if (openPlaylists) setOpenPlaylists(false);
    };

    const handleClose = (e) => {
        if (curPlaylist && curPlaylist.target === e.target) {
            return;
        }
        if (anchorMenuRef.current && anchorMenuRef.current.contains(e.target)) {
            return;
        }

        setOpenMenu(false);
        setOpenPlaylists(false);
    };

    const handleListKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            setOpenMenu(false);
            setOpenPlaylists(false);
        } else if (e.key === 'Escape') {
            setOpenMenu(false);
            setOpenPlaylists(false);
        }
    }

    const handleOnMouseEnterPlaylists = (e) => {
        setOpenPlaylists(true);
    }

    const handleOnClickCreatePlaylist = (e) => {
        setCurPlaylist(e);
        setOpenForm(!openForm);
    }

    return (
        <div className="more">
            <Tooltip title="Xem thêm lựa chọn" disableInteractive>
                <IconButton
                    className="button"
                    ref={anchorMenuRef}
                    id="composition-button"
                    aria-controls={openMenu ? 'composition-menu' : undefined}
                    aria-expanded={openMenu ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                >
                    <MoreVertIcon className="more-icon" />
                </IconButton>
            </Tooltip>

            <Popper
                open={openMenu}
                anchorEl={anchorMenuRef.current}
                role={undefined}
                placement="top-start"
                transition
                disablePortal
                className="popper-list"
            >
                {({ TransitionProps, placement }) => (
                    <Fade
                        {...TransitionProps}
                        timeout={120}
                    >
                        <Paper elevation={3} className="list">
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}
                                >
                                    <MenuItem
                                        className="list-item"
                                        onClick={handleClose}
                                        onMouseEnter={() => setOpenPlaylists(false)}
                                    >
                                        Thêm vào hàng đợi
                                    </MenuItem>
                                    <Divider className="divider" />
                                    <MenuItem
                                        className="list-item"
                                        onClick={handleClose}
                                        onMouseEnter={() => setOpenPlaylists(false)}
                                    >
                                        Đến album
                                    </MenuItem>
                                    <MenuItem
                                        className="list-item"
                                        onClick={handleClose}
                                        onMouseEnter={() => setOpenPlaylists(false)}
                                    >
                                        Đến nghệ sĩ
                                    </MenuItem>
                                    <Divider className="divider" />
                                    <MenuItem
                                        className="list-item"
                                        onClick={handleClose}
                                        onMouseEnter={() => setOpenPlaylists(false)}
                                    >
                                        Thêm vào thư viện
                                    </MenuItem>
                                    <MenuItem
                                        className="list-item playlist"
                                        ref={anchorPlaylistRef}
                                        onMouseEnter={handleOnMouseEnterPlaylists}
                                    >
                                        Thêm vào playlist
                                        <PlayArrowIcon className="more-icon" />
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>

            <Popper
                open={openPlaylists}
                anchorEl={anchorPlaylistRef.current}
                role={undefined}
                placement="right-end"
                transition
                disablePortal
                className="popper-playlists"
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
                                    <MenuItem className="playlist-item" onClick={(e) => setCurPlaylist(e)}>
                                        <FormControlLabel
                                            control={<Checkbox className="checkbox" size="small" />}
                                            label="Playlist 1"
                                            className="form-control"
                                        />
                                        <LockRoundedIcon className="more-icon private" />
                                    </MenuItem>
                                    <MenuItem className="playlist-item" onClick={(e) => setCurPlaylist(e)}>
                                        <FormControlLabel
                                            control={<Checkbox className="checkbox" size="small" />}
                                            label="Playlist 2"
                                            className="form-control"
                                        />
                                        <LockRoundedIcon className="more-icon private" />
                                    </MenuItem>
                                    <MenuItem className="playlist-item" onClick={(e) => setCurPlaylist(e)}>
                                        <FormControlLabel
                                            control={<Checkbox className="checkbox" size="small" />}
                                            label="Playlist 3"
                                            className="form-control"
                                        />
                                        <PublicRoundedIcon className="more-icon public" />
                                    </MenuItem>
                                </div>
                                <div className="more-bottom">
                                    <Divider className="divider" />
                                    <MenuItem className="playlist-item" onClick={handleOnClickCreatePlaylist}>
                                        {openForm
                                            ? <CloseIcon className="more-icon close" />
                                            : <AddRoundedIcon className="more-icon add" />}
                                        Tạo playlist mới
                                    </MenuItem>

                                    {openForm &&
                                        <>
                                            <div className="form-create-playlist" onClick={(e) => setCurPlaylist(e)}>
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
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <InputLabel variant="standard" htmlFor="playlist-type" className="form-label">
                                                        Quyền riêng tư:
                                                    </InputLabel>
                                                    <NativeSelect
                                                        inputProps={{
                                                            name: 'type',
                                                            id: 'playlist-type',
                                                        }}
                                                        className="form-input type"
                                                        value={playlistType}
                                                        onChange={(e) => setPlaylistType(e.target.value)}
                                                    >
                                                        <option value="private">Riêng tư</option>
                                                        <option value="public">Công khai</option>
                                                    </NativeSelect>
                                                </div>
                                                <div className="wrapper-button">
                                                    <button disabled={playlistName ? false : true}>Tạo</button>
                                                </div>
                                            </div>
                                        </>}
                                </div>
                            </MenuList>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </div>
    )
}
