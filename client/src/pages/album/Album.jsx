import React, { useContext, useEffect, useState } from "react";
import "./album.scss";
import playButton from "../../images/playButton.svg";
import pauseButton from "../../images/pauseButton.svg";
import { ColorExtractor } from 'react-color-extractor';
import More from "../../components/more/More";
import { Skeleton, Tooltip } from "@mui/material";
import SongTable from "../../components/songTable/SongTable";
import { Link, useLocation, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { AudioPlayerContext } from "../../context/AudioPlayerContext";
import { QueueContext } from "../../context/QueueContext";
import LikeButton from "../../components/buttons/likeButton/LikeButton";

export default function Album() {
    const [colors, setColors] = useState([]);
    const location = useLocation();
    const title = location.state?.title;
    const params = useParams();
    const albumId = params.id;
    const { data, loading } = useFetch("/albums/find/" + albumId);
    const [avatar, setAvatar] = useState("");
    const totalDuration = data?.songs?.reduce((sum, song) => sum + song.duration_ms, 0);

    const { player, dispatch: dispatchAudio } = useContext(AudioPlayerContext);
    const { currentQueue, dispatch: dispatchQueue } = useContext(QueueContext);

    useEffect(() => {
        if (data?.artists?.length === 1) {
            setAvatar("");
            data?.artists[0]?.images?.forEach((image) => {
                if (image.type === "avatar") {
                    setAvatar(image.src);
                }
            });
        }
    }, [data]);

    useEffect(() => {
        const albumWrapper = document.querySelector(".album-wrapper");
        const disk = document.querySelector(".disk");
        if (colors.length > 0) {
            albumWrapper.style.setProperty("--background-src", `url(${data?.images[0]})`);
            disk.style.setProperty("--color", colors[4]);
            disk.style.setProperty("--color-second", colors[1]);
        }
    }, [colors, data]);

    useEffect(() => {
        document.title = (title ? title : data?.name) + " - Album";
    }, [data, title]);

    const upperCaseFirstLetter = (str) => {
        if (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    };

    const formatDate = (d) => {
        if (d) {
            // Tạo một đối tượng Date từ chuỗi
            const date = new Date(d);

            // Tạo một đối tượng chứa các tùy chọn cho phương thức toLocaleDateString()
            const options = {
                weekday: "long", // Hiển thị tên thứ
                year: "numeric", // Hiển thị năm bằng số
                month: "long", // Hiển thị tên tháng
                day: "numeric" // Hiển thị ngày bằng số
            };

            // Chuyển đối tượng Date sang chuỗi có định dạng mong muốn
            return date.toLocaleDateString("vi-VN", options); // Sử dụng mã ngôn ngữ vi-VN cho tiếng Việt
        }
    }

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

    const handleOnClickPlay = async () => {
        if (player?.currentSong?.itemId !== albumId) {
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
                return { value: song, index: index, type: "album", itemId: albumId };
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
        <div className="album">
            <div className="album-wrapper">
                <div className="top-album">
                    <div className="left">
                        <div className="wrapper-left">
                            <div className="album-img">
                                {loading
                                    ? <Skeleton variant="rounded" className="skeleton" />
                                    :
                                    <ColorExtractor getColors={(colors) => { setColors(colors) }} >
                                        <img src={data?.images && data.images[0]} alt={data?.name} />
                                    </ColorExtractor>
                                }
                            </div>
                            <div className="disk">
                                <div className={`outside ${player?.currentSong?.itemId === albumId && currentQueue?.isPlayed && "played"}`}>
                                    {loading && <Skeleton variant="circular" className="skeleton" />}
                                </div>
                                <div className="inner"></div>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <h4 className="type">
                            {loading
                                ? <Skeleton variant="text" className="skeleton" width={50} />
                                : upperCaseFirstLetter(data?.album_type)}
                        </h4>
                        <h2 className="album-name">
                            {loading
                                ? <Skeleton variant="text" className="skeleton" width={200} />
                                : data?.name}
                        </h2>
                        <div className="owner">
                            {loading
                                ? <div className="owner-img">
                                    <Skeleton variant="circular" className="skeleton" />
                                </div>
                                : data?.artists?.length === 1 &&
                                <div className="owner-img">
                                    <img src={avatar} alt={"Avatar của" + data?.name} />
                                </div>
                            }
                            <p className="owner-name">
                                {loading
                                    ? <Skeleton variant="text" className="skeleton" width={100} />
                                    : <>
                                        {data?.artists?.map((artist, index) => (
                                            <React.Fragment key={artist._id}>
                                                <span>
                                                    <Link
                                                        to={`/artists/${artist._id}`}
                                                        state={{ name: artist.name }}
                                                    >
                                                        {artist.name}
                                                    </Link>
                                                </span>
                                                {index < data.artists.length - 1 &&
                                                    <span className="comma">, </span>
                                                }
                                            </React.Fragment>
                                        ))}
                                    </>}
                            </p>
                        </div>
                        <div className="album-summary">
                            {loading
                                ? <Skeleton variant="text" className="skeleton" width={300} />
                                : <>
                                    <span className="release-date">Năm phát hành: {data?.release_date &&
                                        <Tooltip title={formatDate(data?.release_date)} disableInteractive><b>{(new Date(data?.release_date)).getFullYear()}</b></Tooltip>
                                    }
                                    </span>
                                    <span className="numb-of-songs"> - Số lượng: <b>{data?.songs?.length} bài</b></span>
                                    <span className="total-duration"> - Thời lượng: <b>{formatTotalDuration(totalDuration)}</b></span>
                                </>}
                        </div>
                    </div>
                </div>
                <div className="bottom-album">
                    <div className="buttons" >
                        <Tooltip title={player?.currentSong?.itemId === albumId && currentQueue?.isPlayed ? "Dừng" : "Phát"} disableInteractive>
                            <img
                                src={player?.currentSong?.itemId === albumId && currentQueue?.isPlayed ? pauseButton : playButton}
                                alt={player?.currentSong?.itemId === albumId && currentQueue?.isPlayed ? "Pause Icon" : "Play Icon"}
                                onClick={handleOnClickPlay}
                                className="play-pause"
                            />
                        </Tooltip>

                        <LikeButton custom={true} type="album" itemId={data?._id} />

                        <More
                            artists={data?.artists}
                            songs={data?.songs}
                            type="album"
                            itemId={data?._id}
                            img={data?.images && data?.images[0]}
                        />
                    </div>
                    <div className="songs">
                        <SongTable type="album" songs={data?.songs} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    )
}
