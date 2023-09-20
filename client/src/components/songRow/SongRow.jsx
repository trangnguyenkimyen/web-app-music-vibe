import "./songRow.scss";
import songImg from "../../images/song/forgetmenow.jpg";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import More from "../more/More";
import { useState } from "react";
import MusicWave from "../musicWave/MusicWave";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { withStyles } from "@mui/styles";

export default function SongRow({ type, number }) {
    const [liked, setLiked] = useState(false);
    const [played, setPlayed] = useState(false);
    const CustomTooltip = withStyles(theme => ({
        tooltip: {
            zIndex: -1,
        },
    }))(Tooltip);

    return (
        <div className="song-row" tabIndex="0">
            <div className="number">
                {played
                    ? <MusicWave />
                    : <span className="text">{number}</span>}
                {played
                    ? <PauseRoundedIcon className="icon pause" onClick={() => setPlayed(!played)} />
                    : <PlayArrowRoundedIcon className="icon play" onClick={() => setPlayed(!played)} />}
            </div>
            <div className={`song-info ${type === "playlist" ? "playlist" : "album"}`}>
                <div className="wrapper-img">
                    <img src={songImg} alt="Forget me now" />
                </div>
                <div className="wrapper-text">
                    <Link to="/albums/1">
                        <h4 className={`name ${played && "played"}`}>Forget me now</h4>
                    </Link>
                    <div className="artists">
                        <Link to="/artists/1">
                            <span>Artist 1</span>
                        </Link>
                        <span className="comma">, </span>
                        <Link to="/artists/2">
                            <span>Artist 2</span>
                        </Link>
                    </div>
                </div>
            </div>
            {type === "playlist"
                ? <>
                    <div className="song-album">
                        <Link to="/albums/1">
                            <span className="text">Album 1</span>
                        </Link>
                    </div>
                    <div className="song-createdAt">
                        <span className="text">1 hour ago</span>
                    </div>
                </>
                : <div className="song-plays">
                    <span className="text">3,123,123</span>
                </div>}
            <div className="button liked">
                <CustomTooltip title={liked ? "Xóa khỏi thư viện" : "Thêm vào thư viện"} disableInteractive>
                    {liked
                        ? <FavoriteIcon className="icon unliked" onClick={() => setLiked(!liked)} />
                        : <FavoriteBorderIcon className="icon liked" onClick={() => setLiked(!liked)} />}
                </CustomTooltip>
            </div>
            <div className="song-duration">
                <span className="text">3:15</span>
            </div>
            <div className="button more">
                <More />
            </div>
        </div>
    )
}
