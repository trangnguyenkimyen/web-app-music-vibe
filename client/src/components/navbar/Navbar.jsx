import "./navbar.scss";
import SearchIcon from '@mui/icons-material/Search';
import noAvatar from "../../images/noAvatar.png";
import { MenuList, MenuItem, Popper, Divider, Paper, ClickAwayListener, Fade } from "@mui/material";
import { useRef, useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleClose = () => {
        setOpen(false);
    };

    const handleListKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            setOpen(false);
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    }

    return (
        <div className="navbar">
            <div className="navbar-wrapper">
                <div className="left">
                    <div className="wrapper-left">
                        <SearchIcon className="icon search" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Bạn có muốn nghe bài nào không?"
                        />
                    </div>
                </div>
                <div className="right">
                    <img
                        ref={anchorRef}
                        src={noAvatar}
                        alt="Default avatar"
                        className="avatar"
                        onClick={() => setOpen(!open)}
                    />
                    <div className="user-info">
                        <h4 className="username">John Doe</h4>
                        <p className="email">@johndoe</p>
                    </div>
                    <Popper
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        placement="bottom-end"
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Fade
                                {...TransitionProps}
                                timeout={120}
                            >
                                <Paper elevation={3} className="list">
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList
                                            onKeyDown={handleListKeyDown}
                                        >
                                            <MenuItem onClick={handleClose} className="list-item">
                                                Profile
                                            </MenuItem>
                                            <MenuItem onClick={handleClose} className="list-item">
                                                Tài khoản của tôi
                                            </MenuItem>
                                            <MenuItem onClick={handleClose} className="list-item premium">
                                                Vibe Premium
                                            </MenuItem>
                                            <Divider className="divider" />
                                            <MenuItem onClick={handleClose} className="list-item">
                                                Đăng xuất
                                            </MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Fade>
                        )}
                    </Popper>
                </div>
            </div>
        </div>
    )
}
