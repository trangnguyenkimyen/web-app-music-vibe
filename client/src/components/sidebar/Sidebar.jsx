import "./sidebar.scss";
import logo from "../../images/logo.svg";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import QueueMusicOutlinedIcon from '@mui/icons-material/QueueMusicOutlined';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { Divider } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();
    const page = location.pathname.split("/")[1];

    return (
        <div className="sidebar">
            <Link to="/">
                <img src={logo} alt="logo" className="logo" />
            </Link>
            <Divider className="sidebar-divider" />
            <Link to="/">
                <div className={`sidebar-button ${page === "" && "selected"}`}>
                    {page === ""
                        ? <HomeIcon className="sidebar-icon home" />
                        : <HomeOutlinedIcon className="sidebar-icon home" />}
                    <span className="sidebar-text">Home</span>
                </div>
            </Link>
            <Link to="/statistic">
                <div className={`sidebar-button ${page === "statistic" && "selected"}`}>
                    {page === "statistic"
                        ? <LeaderboardIcon className="sidebar-icon statistic" />
                        : <LeaderboardOutlinedIcon className="sidebar-icon statistic" />}
                    <span className="sidebar-text">Thống kê</span>
                </div>
            </Link>
            <Divider className="sidebar-divider" />
            <Link to="/library">
                <div className={`sidebar-button ${page === "library" && "selected"}`}>
                    {page === "library"
                        ? <FavoriteIcon className="sidebar-icon favorSong" />
                        : <FavoriteBorderOutlinedIcon className="sidebar-icon favorSong" />}
                    <span className="sidebar-text">Thư viện</span>
                </div>
            </Link>
            <Link to="/my-playlists">
                <div className={`sidebar-button ${page === "my-playlists" && "selected"}`}>
                    {page === "my-playlists"
                        ? <QueueMusicIcon className="sidebar-icon playlist" />
                        : <QueueMusicOutlinedIcon className="sidebar-icon playlist" />}
                    <span className="sidebar-text">Playlist của bạn</span>
                </div>
            </Link>
            <Link to="/recent-listen">
                <div className={`sidebar-button ${page === "recent-listen" && "selected"}`}>
                    <SettingsBackupRestoreIcon className="sidebar-icon recentListen" />
                    <span className="sidebar-text">Nghe gần đây</span>
                </div>
            </Link>
        </div>
    )
}
