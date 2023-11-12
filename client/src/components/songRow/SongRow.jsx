import "./songRow.scss";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import More from "../more/More";
import React, { useContext } from "react";
import MusicWave from "../musicWave/MusicWave";
import { Link, useParams } from "react-router-dom";
import { format } from "timeago.js";
import { AudioPlayerContext } from "../../context/AudioPlayerContext";
import { QueueContext } from "../../context/QueueContext";
import axios from "axios";
import LikeButton from "../buttons/likeButton/LikeButton";

export default function SongRow({ type, number, song, createdAt }) {
    const params = useParams();
    const itemId = params.id;
    const createdAtFormat = format(createdAt && createdAt).split(" ");
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    const { player, dispatch: dispatchAudio } = useContext(AudioPlayerContext);
    const { currentQueue, dispatch: dispatchQueue } = useContext(QueueContext);

    const formatDuration = (value) => {
        const seconds = value / 1000;
        const minute = Math.floor(seconds / 60);
        const secondLeft = Math.floor(seconds - minute * 60);
        return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
    };

    const formatCreatedAt = (value) => {
        if (value[1] === "now") {
            return "Bây giờ";
        }
        if (value[1] === "seconds" || value[1] === "second") {
            return "giây trước";
        }
        if (value[1] === "minutes" || value[1] === "minute") {
            return "phút trước";
        }
        if (value[1] === "hours" || value[1] === "hour") {
            return "giờ trước";
        }
        if (value[1] === "days" || value[1] === "day") {
            return "ngày trước";
        }
        if (value[1] === "weeks" || value[1] === "week") {
            return "tuần trước";
        }
        if (value[1] === "months" || value[1] === "month") {
            return "tháng trước";
        }
        if (value[1] === "years" || value[1] === "year") {
            return "năm trước";
        }
    }

    const handleOnClickPlay = async () => {
        if ((type === "library" && player?.currentSong?.value?._id !== song._id) || (player?.currentSong?.itemId !== itemId)) {
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

            let res = [];
            let data = [];
            if (type === "playlist") {
                res = await axios.get("/playlists/find/" + itemId);
                data = res.data.songs;
            } else if (type === "album") {
                res = await axios.get("/albums/find/" + itemId);
                data = res.data.songs;
            } else if (type === "library") {
                res = await axios.get("/me/liked-songs");
                data = res.data;
            }
            else {
                res = await axios.get("/artists/" + itemId + "/top-songs?limit=10");
                data = res.data;
            }

            const initialData = data?.map((item, index) => {
                return { value: item, index: index, type: type, itemId: itemId };
            });

            const index = number - 1;

            // Update audio
            await dispatchAudio({
                type: "SET_PLAYER", payload: {
                    currentSong: initialData[index]
                }
            });

            const array = await initialData?.filter((item, index) => {
                return (index + 1) > number;
            });
            // Update current queue
            await dispatchQueue({
                type: "SET_CURRENTQUEUE", payload: {
                    data: array,
                    initialData: initialData,
                    isShuffled: false,
                    initialRandomQueue: null,
                    replayed: 0,
                    isPlayed: true
                }
            });
        } else {
            if (song?._id !== player?.currentSong?.value?._id) {
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

                const index = number - 1;

                // Update audio
                await dispatchAudio({
                    type: "SET_PLAYER", payload: {
                        currentSong: currentQueue?.initialData[index]
                    }
                });

                const array = await currentQueue?.initialData?.filter((item, index) => {
                    return (index + 1) > number;
                });
                // Update current queue
                await dispatchQueue({
                    type: "SET_CURRENTQUEUE", payload: {
                        data: array,
                        initialData: currentQueue?.initialData,
                        isShuffled: false,
                        initialRandomQueue: null,
                        replayed: 0,
                        isPlayed: true
                    }
                });

                return;
            }
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
        <div
            className="song-row"
            tabIndex="0"
            onClick={() => { isTouchDevice && handleOnClickPlay() }}
        >
            <div className="number">
                {player?.currentSong?.itemId === itemId && player?.currentSong?.value?._id === song?._id && currentQueue?.isPlayed
                    ? <MusicWave />
                    : <span className="text">{number}</span>}
                {player?.currentSong?.itemId === itemId && player?.currentSong?.value?._id === song?._id && currentQueue?.isPlayed
                    ? <PauseRoundedIcon className="icon pause" onClick={handleOnClickPlay} />
                    : <PlayArrowRoundedIcon className="icon play" onClick={handleOnClickPlay} />}
            </div>
            <div className={`song-info ${type === "playlist" ? "playlist" : "album"}`}>
                <div className="wrapper-img">
                    <img src={song?.album?.images && song.album.images[0]} alt={song?.name} />
                </div>
                <div className="wrapper-text">
                    <h4 className={`name ${player?.currentSong?.itemId === itemId && player?.currentSong?.value?._id === song?._id && "played"}`}>
                        {isTouchDevice
                            ? song?.name
                            :
                            <Link
                                to={`/albums/${song?.album?._id}`}
                                state={{ title: song?.album?.name }}
                            >
                                {song?.name}
                            </Link>
                        }
                    </h4>
                    <div className="artists">
                        {song?.artists?.map((artist, index) => (
                            <React.Fragment key={artist._id}>
                                <span>
                                    {isTouchDevice
                                        ? artist.name
                                        :
                                        <Link to={`/artists/${artist._id}`}>
                                            {artist.name}
                                        </Link>
                                    }
                                </span>
                                {index < song.artists.length - 1 &&
                                    <span className="comma">, </span>
                                }
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
            {type === "playlist"
                ? <>
                    <div className="song-album">
                        <span className="text">
                            {isTouchDevice
                                ? song?.album?.name
                                :
                                <Link to={`/albums/${song?.album?._id}`}>
                                    {song?.album?.name}
                                </Link>
                            }
                        </span>
                    </div>
                    <div className="song-createdAt">
                        <span className="text">
                            {createdAtFormat && createdAtFormat[0] === "just"
                                ? formatCreatedAt(createdAtFormat)
                                : createdAtFormat[0] + " " + formatCreatedAt(createdAtFormat)}
                        </span>
                    </div>
                </>
                : <div className="song-plays">
                    <span className="text">3,123,123</span>
                </div>}

            <div className="button like">
                <LikeButton
                    custom={true}
                    type="song"
                    itemId={song?._id}
                />
            </div>

            <div className="song-duration">
                <span className="text">{formatDuration(song?.duration_ms)}</span>
            </div>
            <div className="button more">
                <More
                    artists={song?.artists}
                    album={song?.album}
                    songs={[song]}
                    type="song"
                    itemId={song?._id}
                    img={song?.album?.images[0]}
                />
            </div>
        </div>
    )
}
