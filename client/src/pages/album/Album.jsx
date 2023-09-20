import { useEffect, useState } from "react";
import "./album.scss";
import img from "../../images/song/forgetmenow.jpg";
import ownerImg from "../../images/artist/amee.jpg";
import playButton from "../../images/playButton.svg";
import pauseButton from "../../images/pauseButton.svg";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { ColorExtractor } from 'react-color-extractor';
import More from "../../components/more/More";
import { Tooltip } from "@mui/material";
import SongTable from "../../components/songTable/SongTable";
import { Link } from "react-router-dom";
import Card from "../../components/card/Card";
import { withStyles } from "@mui/styles";

export default function Album() {
    const [colors, setColors] = useState([]);
    const [played, setPlayed] = useState(false);
    const [liked, setLiked] = useState(false);
    const CustomTooltip = withStyles(theme => ({
        tooltip: {
            zIndex: -1,
        },
    }))(Tooltip);

    useEffect(() => {
        const albumWrapper = document.querySelector(".album-wrapper");
        const disk = document.querySelector(".disk");
        if (colors.length > 0) {
            albumWrapper.style.setProperty("--background-src", `url(${img})`)
            disk.style.setProperty("--color", colors[4]);
            disk.style.setProperty("--color-second", colors[0]);
        }
    }, [colors]);

    useEffect(() => {
        document.title = "Name of album - Album";
    }, []);

    return (
        <div className="album">
            <div className="album-wrapper">
                <div className="top-album">
                    <div className="left">
                        <div className="album-img">
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
                        <h4 className="type">Album</h4>
                        <h2 className="album-name">Name of album</h2>
                        <div className="owner">
                            <div className="owner-img">
                                <img src={ownerImg} alt="Owner img" />
                            </div>
                            <p className="owner-name">Owner</p>
                        </div>
                        <div className="album-summary">
                            <span>Năm phát hành: <Tooltip title="Thứ ba, 26 Tháng 7, 2023 lúc 20:53" disableInteractive><b>2023</b></Tooltip></span>
                            <span> - Số lượng: <b>10 bài</b></span>
                            <span> - Thời lượng: <b>30 phút 17 giây</b></span>
                        </div>
                    </div>
                </div>
                <div className="bottom-album">
                    <div className="buttons" >
                        <Tooltip title={played ? "Dừng" : "Phát"} disableInteractive>
                            <img
                                src={!played ? playButton : pauseButton}
                                alt={!played ? "Play Icon" : "Pause Icon"}
                                onClick={() => setPlayed(!played)}
                                className="play-pause"
                            />
                        </Tooltip>
                        <CustomTooltip title={liked ? "Xóa khỏi thư viện" : "Thêm vào thư viện"} disableInteractive>
                            {liked
                                ? <FavoriteIcon className="icon unliked" onClick={() => setLiked(!liked)} />
                                : <FavoriteBorderOutlinedIcon className="icon liked" onClick={() => setLiked(!liked)} />}
                        </CustomTooltip>
                        <More />
                    </div>
                    <div className="songs">
                        <SongTable type="album" />
                    </div>
                    <div className="more-by-artist">
                        <div className="section">
                            <div className="title">
                                <h3 className="title-text">Liên quan đến Artist</h3>
                                <Link to="/section/Liên quan đến Artist">
                                    <p className="more">Xem thêm</p>
                                </Link>
                            </div>
                            <div className="cards">
                                {[...Array(5)].map((_, index) => (
                                    <div className="wrapper-item">
                                        <div className="item">
                                            <Link to={`/albums/${index}`}>
                                                <Card key={index} type="album" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
