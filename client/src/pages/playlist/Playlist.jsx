import { useContext, useEffect, useState } from "react";
import "./playlist.scss";
import adminImg from "../../images/defaultAvatar.png";
import noAvatar from "../../images/noAvatar.png";
import playButton from "../../images/playButton.svg";
import pauseButton from "../../images/pauseButton.svg";
import { ColorExtractor } from 'react-color-extractor';
import More from "../../components/more/More";
import SongTable from "../../components/songTable/SongTable";
import { Skeleton, Tooltip } from "@mui/material";
import useFetch from "../../hooks/useFetch";
import { Link, useLocation, useParams } from "react-router-dom";
import { AudioPlayerContext } from "../../context/AudioPlayerContext";
import { QueueContext } from "../../context/QueueContext";
import { AuthContext } from "../../context/AuthContext";
import LikeButton from "../../components/buttons/likeButton/LikeButton";

export default function Playlist() {
    const [colors, setColors] = useState([]);
    const location = useLocation();
    const title = location.state?.title;
    const params = useParams();
    const playlistId = params.id;
    const { data, loading } = useFetch("/playlists/find/" + playlistId);
    const followers = data?.followers?.length + 10000;
    const totalDuration = data?.songs?.reduce((sum, song) => sum + song.duration_ms, 0);

    const { user } = useContext(AuthContext);
    const { player, dispatch: dispatchAudio } = useContext(AudioPlayerContext);
    const { currentQueue, dispatch: dispatchQueue } = useContext(QueueContext);

    const formatTotalDuration = (value) => {
        const hours = Math.floor(value / 3600000);
        if (hours > 0) {
            const minutes = Math.floor((value - hours * 3600000) / 60000);
            return `${hours} giờ ${minutes} phút`;
        } else {
            const minutes = Math.floor(value / 60000);
            const seconds = Math.floor((value - minutes * 60000) / 1000);
            return `${minutes} phút ${seconds} giây`;
        }
    };

    useEffect(() => {
        const playlistWrapper = document.querySelector(".playlist-wrapper");
        const disk = document.querySelector(".disk");
        if (colors.length > 0) {
            playlistWrapper.style.setProperty("--background-src", `url(${data?.images[0]})`)
            disk.style.setProperty("--color", colors[4]);
            disk.style.setProperty("--color-second", colors[0]);
        }
    }, [colors, data]);

    useEffect(() => {
        document.title = (title ? title : data?.name) + " - Playlist";
    }, [data, title]);

    const handleOnClickPlay = async () => {
        if (player?.currentSong?.itemId !== playlistId) {
            // Stop the current audio
            if (currentQueue?.isPlayed) {
                await dispatchQueue({
                    type: "SET_CURRENTQUEUE", payload: {
                        data: currentQueue?.data,
                        initialData: currentQueue?.initialData,
                        isShuffled: currentQueue?.isShuffled,
                        initialRandomQueue: currentQueue?.initialRandomQueue,
                        replayed: currentQueue?.replayed,
                        isPlayed: false
                    }
                });
            }

            const initialArray = await data?.songs?.map((song, index) => {
                return { value: song, index: index, type: "playlist", itemId: playlistId };
            });

            const array = await initialArray.filter((item, index) => {
                return index > 0;
            });

            // Update current song
            await dispatchAudio({
                type: "SET_PLAYER", payload: {
                    currentSong: initialArray[0],
                }
            });

            // Update current queue
            await dispatchQueue({
                type: "SET_CURRENTQUEUE", payload: {
                    data: array,
                    initialData: initialArray,
                    isShuffled: false,
                    initialRandomQueue: null,
                    replayed: 0,
                    isPlayed: true
                }
            });
        } else {
            // Update isPlayed
            await dispatchQueue({
                type: "SET_CURRENTQUEUE", payload: {
                    data: currentQueue?.data,
                    initialData: currentQueue?.initialData,
                    isShuffled: currentQueue?.isShuffled,
                    initialRandomQueue: currentQueue?.initialRandomQueue,
                    replayed: currentQueue?.replayed,
                    isPlayed: !currentQueue?.isPlayed
                }
            });
        }
    };

    return (
        <div className="playlist">
            <div className="playlist-wrapper">
                <div className="top-playlist">
                    <div className="left">
                        <div className="wrapper-left">
                            <div className="playlist-img">
                                {loading
                                    ? <Skeleton variant="rounded" className="skeleton" />
                                    : <ColorExtractor getColors={(colors) => { setColors(colors) }} >
                                        <img src={data?.images && data.images[0]} alt="" />
                                    </ColorExtractor>
                                }
                            </div>

                            <div className="disk">
                                <div className={`outside ${player?.currentSong?.itemId === playlistId && currentQueue?.isPlayed && "played"}`}>
                                    {loading && <Skeleton variant="circular" className="skeleton" />}
                                </div>
                                <div className="inner"></div>
                            </div>

                        </div>
                    </div>
                    <div className="right">
                        <h4 className={`type ${data?.owner?.isAdmin && "isAdmin"}`}>
                            {loading
                                ? <Skeleton variant="text" className="skeleton" width={100} />
                                : data?.public ? "Công khai" : "Riêng tư"}
                        </h4>
                        <h2 className={`playlist-name ${data?.owner?.isAdmin && "isAdmin"}`}>
                            {loading
                                ? <Skeleton variant="text" className="skeleton" width={300} />
                                : data?.name}
                        </h2>
                        <p className="playlist-desc">
                            {loading
                                ? <Skeleton variant="text" className="skeleton" width={400} />
                                : data?.desc}
                        </p>
                        <div className="owner">
                            <div className="owner-img">
                                {loading
                                    ? <Skeleton variant="circular" className="skeleton" />
                                    : <img
                                        src={data?.owner?.isAdmin ? adminImg
                                            : data?.owner?.img
                                                ? data.owner.img
                                                : noAvatar}
                                        alt="Owner img"
                                    />}

                            </div>
                            {loading
                                ? <Skeleton variant="text" className="skeleton" width={100} />
                                :
                                <Link
                                    to={`/users/${data?.owner?._id}`}
                                    state={{ title: data?.owner?.name }}
                                >
                                    <p className="owner-name">
                                        {data?.owner?.isAdmin ? "vibe" : data?.owner?.name}
                                    </p>
                                </Link>
                            }
                        </div>
                        <div className="playlist-summary">
                            {loading
                                ? <Skeleton variant="text" className="skeleton" width={400} />
                                : <>
                                    <p>
                                        <span className="followers">Lượt thích: <b>{followers.toLocaleString('en-US')}</b></span>
                                        <span className="numb-of-songs"> - Số lượng: <b>{data?.songs?.length} bài</b></span>
                                        <span className="duration"> - Thời lượng: <b>{formatTotalDuration(totalDuration)}</b></span>
                                    </p>
                                </>}
                        </div>
                    </div>
                </div>
                <div className="bottom-playlist">
                    <div className="buttons" >
                        <Tooltip title={player?.currentSong?.itemId === playlistId && currentQueue?.isPlayed ? "Dừng" : "Phát"} disableInteractive>
                            <img
                                src={player?.currentSong?.itemId === playlistId && currentQueue?.isPlayed ? pauseButton : playButton}
                                alt={player?.currentSong?.itemId === playlistId && !currentQueue?.isPlayed ? "Play Icon" : "Pause Icon"}
                                onClick={handleOnClickPlay}
                                className="play-pause"
                            />
                        </Tooltip>

                        <LikeButton
                            custom={true}
                            type="playlist"
                            itemId={data?._id}
                            playlist={{
                                name: data?.name,
                                public: data?.public,
                                owner: data?.owner?._id
                            }}
                        />

                        <More
                            songs={data?.songs}
                            type="playlist"
                            itemId={data?._id}
                            img={data?.images && data?.images[0]}
                            playlist={{
                                name: data?.name,
                                public: data?.public,
                                owner: data?.owner?._id
                            }}
                        />
                    </div>
                    <div className="songs">
                        <SongTable type="playlist" songs={data?.songs} createdAt={data?.createdAt} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    )
}
