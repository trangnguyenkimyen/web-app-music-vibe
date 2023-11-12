import "./navbar.scss";
import SearchIcon from '@mui/icons-material/Search';
import noAvatar from "../../images/noAvatar.png";
import { MenuList, MenuItem, Popper, Divider, Paper, ClickAwayListener, Fade } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const location = useLocation();
    const currentPath = decodeURIComponent(location.pathname);
    const page = currentPath.split("/")[1];
    let navigate = useNavigate();

    const { user, dispatch } = useContext(AuthContext);
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (user) {
            const mail = user?.email?.split("@");
            setEmail(mail[0]);
        }
    }, [user]);

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
    };

    const handleOnKeyDownInput = (e) => {
        if (e.key === "Enter") {
            if (e.target.value !== "") {
                navigate("/search?q=" + e.target.value);
            }
            e.target.blur();
        }
    };

    const handleOnClickLogout = async () => {
        handleClose();
        try {
            await axios.get(process.env.REACT_APP_API_URL + "/users/logout");
            dispatch({ type: "LOGOUT" });
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="navbar">
            <div className="navbar-wrapper">
                <div className="left">
                    <div className="wrapper-left">
                        <label htmlFor="search">
                            <SearchIcon className="icon search" />
                        </label>

                        <input
                            id="search"
                            type="text"
                            className="search-input"
                            placeholder="Bạn có muốn nghe bài nào không?"
                            onKeyDown={handleOnKeyDownInput}
                        />
                    </div>
                </div>
                <div className="right">
                    {!user
                        ?
                        <Link to="/login">
                            <div className={`logIn-btn ${page === "login" || page === "auth"}`}>
                                Đăng nhập
                            </div>
                        </Link>
                        : <>
                            <img
                                ref={anchorRef}
                                src={user?.img || noAvatar}
                                alt="Avatar"
                                className="avatar"
                                onClick={() => setOpen(!open)}
                            />
                            <div className="user-info">
                                <h4 className="username">{user?.name}</h4>
                                <p className="email">@{email}</p>
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
                                                    <MenuItem onClick={handleOnClickLogout} className="list-item">
                                                        Đăng xuất
                                                    </MenuItem>
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Fade>
                                )}
                            </Popper>
                        </>}
                </div>
            </div>
        </div>
    )
}
