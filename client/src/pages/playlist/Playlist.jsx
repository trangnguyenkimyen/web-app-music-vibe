import { useEffect, useState } from "react";
import "./playlist.scss";
import img from "../../images/song/forgetmenow.jpg";
import ownerImg from "../../images/artist/amee.jpg";
import playButton from "../../images/playButton.svg";
import pauseButton from "../../images/pauseButton.svg";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { ColorExtractor } from 'react-color-extractor';
import More from "../../components/more/More";
import SongTable from "../../components/songTable/SongTable";
import { Tooltip } from "@mui/material";
import { withStyles } from "@mui/styles";

export default function Playlist() {
    const [colors, setColors] = useState([]);
    const [played, setPlayed] = useState(false);
    const [likedPlaylist, setLikedPlaylist] = useState(false);
    const CustomTooltip = withStyles(theme => ({
        tooltip: {
            zIndex: -1,
        },
    }))(Tooltip);

    useEffect(() => {
        const playlistWrapper = document.querySelector(".playlist-wrapper");
        const disk = document.querySelector(".disk");
        if (colors.length > 0) {
            playlistWrapper.style.setProperty("--background-src", `url(${img})`)
            disk.style.setProperty("--color", colors[4]);
            disk.style.setProperty("--color-second", colors[0]);
        }
    }, [colors]);

    useEffect(() => {
        document.title = "Name of playlist - Playlist";
    }, []);

    return (
        <div className="playlist">
            <div className="playlist-wrapper">
                <div className="top-playlist">
                    <div className="left">
                        <div className="playlist-img">
                            <ColorExtractor getColors={(colors) => { setColors(colors) }} >
                                <img src={img} alt="" />
                            </ColorExtractor>
                        </div>
                        <div className="disk">
                            <div className={`outside ${played && "played"}`}></div>
                            <div className="inner"></div>
                        </div>
                    </div>
                    <div className="right">
                        <h4 className="type">Public Playlist</h4>
                        <h2 className="playlist-name">Name of playlist</h2>
                        <p className="playlist-desc">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        <div className="owner">
                            <div className="owner-img">
                                <img src={ownerImg} alt="Owner img" />
                            </div>
                            <p className="owner-name">Owner</p>
                        </div>
                        <div className="playlist-summary">
                            Lượt thích: <b>14,390</b> - Số lượng: <b>10 bài</b> - Thời lượng: <b>30 phút 17 giây</b>
                        </div>
                    </div>
                </div>
                <div className="bottom-playlist">
                    <div className="buttons" >
                        <Tooltip title={played ? "Dừng" : "Phát"} disableInteractive>
                            <img
                                src={!played ? playButton : pauseButton}
                                alt={!played ? "Play Icon" : "Pause Icon"}
                                onClick={() => setPlayed(!played)}
                                className="play-pause"
                            />
                        </Tooltip>

                        <CustomTooltip title={likedPlaylist ? "Xóa khỏi thư viện" : "Thêm vào thư viện"} disableInteractive>
                            {likedPlaylist
                                ? <FavoriteIcon className="icon unliked" onClick={() => setLikedPlaylist(!likedPlaylist)} />
                                : <FavoriteBorderOutlinedIcon className="icon liked" onClick={() => setLikedPlaylist(!likedPlaylist)} />}
                        </CustomTooltip>
                        <More />
                    </div>
                    <div className="songs">
                        <SongTable type="playlist" />
                    </div>
                </div>
            </div>
        </div>
    )
}
