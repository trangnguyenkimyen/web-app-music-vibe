import "./songItem.scss";
import songImg from "../../images/song/forgetmenow.jpg";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import More from "../more/More";
import { useEffect, useState } from "react";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import { IconButton, Tooltip } from "@mui/material";
import MusicWave from "../musicWave/MusicWave";
import { withStyles } from "@mui/styles";

export default function SongItem({ isLiked, idSong, curSong, setCurSong, full }) {
    const [liked, setLiked] = useState(isLiked);
    const [played, setPlayed] = useState(false);
    const CustomTooltip = withStyles(theme => ({
        tooltip: {
            zIndex: -1,
        },
    }))(Tooltip);

    useEffect(() => {
        if (played) setCurSong(idSong);
    }, [played, idSong, setCurSong]);

    useEffect(() => {
        if (curSong === idSong) {
            setPlayed(true);
        } else {
            setPlayed(false);
        }
    }, [curSong, idSong]);

    return (
        <div
            className={`songItem ${curSong === idSong && "played"}`}
            onClick={(e) => { e.target.focus() }}
            tabIndex="0"
        >
            <div className="left">
                <div className="songItem-img">
                    <img src={songImg} alt="Song 1" />
                    {played && <MusicWave />}
                    <IconButton className="button" onClick={() => setPlayed(!played)}>
                        {played
                            ? <PauseRoundedIcon
                                className="icon pause"
                            />
                            : <PlayArrowRoundedIcon
                                className="icon play"
                            />}
                    </IconButton>
                </div>
                <div className="songItem-info">
                    <h4 className="name">Forget me now</h4>
                    <div className="artists">
                        <span>Artist 1</span>
                        <span className="comma">, </span>
                        <span>Artist 2</span>
                    </div>
                </div>
            </div>
            <div className="right">
                <div className="like-button" onClick={() => setLiked(!liked)}>
                    <CustomTooltip title={liked ? "Xóa khỏi thư viện" : "Thêm vào thư viện"} placement="top" disableInteractive>
                        {liked
                            ? <FavoriteIcon
                                className="icon unliked"
                            />
                            : <FavoriteBorderIcon
                                className="icon liked"
                            />}
                    </CustomTooltip>
                </div>
                <div className="listeners">
                    <span className="text">1,304K</span>
                    <HeadphonesIcon className="icon headphone" />
                </div>
                <More />
            </div>
        </div>
    )
}
