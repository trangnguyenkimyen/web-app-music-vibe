import "./card.scss";
import img from "../../images/song/forgetmenow.jpg";
import noAvatar from "../../images/noAvatar.png";
import adminImg from "../../images/defaultAvatar.png";
import { Link } from "react-router-dom";
import { Skeleton } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { QueueContext } from "../../context/QueueContext";
import PlayPauseVibe from "../buttons/playPauseVibe/PlayPauseVibe";
import { AudioPlayerContext } from "../../context/AudioPlayerContext";

export default function Card({ type, mixImg, item }) {
    const { currentQueue } = useContext(QueueContext);
    const { player } = useContext(AudioPlayerContext);
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    const handleMouseMove = (e) => {
        const card = e.target;
        const cardRect = card.getBoundingClientRect();
        const x = e.pageX - cardRect.left;
        const y = e.pageY - cardRect.top;

        card.style.setProperty("--x", x);
        card.style.setProperty("--y", y);
    };

    const [artistImg, setArtistImg] = useState(null);
    useEffect(() => {
        if (type === "artist") {
            const img = item?.images?.filter(img => {
                return img?.type === "avatar";
            });
            setArtistImg(img[0]?.src);
        }
    }, [item?.images, type]);

    return (
        <div className="wrapper-item">
            <div className="item">
                <Link
                    to={`/${type === "song" ? "album" : type === "profile" ? "user" : type}s/${type !== "song" ? item?._id : (item?.album[0]?._id || item?.album?._id)} `}
                    state={{ title: item?.name }}
                >
                    <div className={`card ${type}`} onMouseMove={handleMouseMove}>
                        <div className="inner">
                            {type !== "profile" && !isTouchDevice &&
                                <div className={`card-button ${player?.currentSong?.itemId === item?._id && currentQueue?.isPlayed && "played"}`} >
                                    <PlayPauseVibe item={item} type={type} />
                                </div>
                            }
                            <div className="card-img">
                                {!item
                                    ? <Skeleton variant="rounded" className="skeleton" />
                                    : <>
                                        {mixImg
                                            ? <>
                                                <div className="row first">
                                                    <div className="wrapper-img">
                                                        <img src={img} alt="Img 1" />
                                                    </div>
                                                    <div className="wrapper-img">
                                                        <img src={img} alt="Img 2" />
                                                    </div>
                                                </div>
                                                <div className="row second">
                                                    <div className="wrapper-img">
                                                        <img src={img} alt="Img 3" />
                                                    </div>
                                                    <div className="wrapper-img">
                                                        <img src={img} alt="Img 4" />
                                                    </div>
                                                </div>
                                            </>
                                            : type === "artist"
                                                ? <img src={artistImg} alt={item.name} />
                                                : type === "profile"
                                                    ? <img src={item.isAdmin ? adminImg : (item.img || noAvatar)} alt={item.isAdmin ? "vibe" : item.name} />
                                                    : type === "song"
                                                        ? <img src={!item.album[0] ? item.album.images[0] : item.album[0].images[0]} alt={item.name} />
                                                        : <img src={item.images[0]} alt={item.name} />
                                        }
                                    </>}
                            </div>
                            <div className="card-content" >
                                <div className="wrapper-card-content">
                                    {!item
                                        ? <Skeleton variant="rounded" className="skeleton" />
                                        : <>
                                            <h4 className="name">{type === "profile" ? (item.isAdmin ? "vibe" : item.name) : item.name}</h4>
                                            <div className="content">
                                                <p>
                                                    {type === "playlist"
                                                        ? <>
                                                            <span>{item.desc}</span>
                                                        </>
                                                        : <>
                                                            {item.artists?.map((artist, index) => (
                                                                <React.Fragment key={artist._id}>
                                                                    <span>{artist.name}</span>
                                                                    {index < item.artists.length - 1 &&
                                                                        <span className="comma">, </span>
                                                                    }
                                                                </React.Fragment>
                                                            ))}
                                                        </>
                                                    }
                                                </p>
                                            </div>
                                        </>}
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}
