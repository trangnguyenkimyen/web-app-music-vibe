import "./queueItem.scss";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { AudioPlayerContext } from "../../context/AudioPlayerContext";
import { QueueContext } from "../../context/QueueContext";
import LikeButton from "../buttons/likeButton/LikeButton";
import MusicWave from "../musicWave/MusicWave";

export default function QueueItem({ played, item, number, user }) {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    const formatDuration = (value) => {
        const seconds = value / 1000;
        const minute = Math.floor(seconds / 60);
        const secondLeft = Math.floor(seconds - minute * 60);
        return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
    };

    const { dispatch: dispatchAudio } = useContext(AudioPlayerContext);
    const { currentQueue, dispatch: dispatchQueue } = useContext(QueueContext);

    const handleOnClickPlay = async () => {
        if (number === 1) {
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
        } else {
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

            await dispatchAudio({
                type: "SET_PLAYER", payload: {
                    currentSong: item
                }
            });
            const updatedQueue = await currentQueue?.data?.filter((item, index) => {
                return (index + 1) >= number;
            });
            await dispatchQueue({
                type: "SET_CURRENTQUEUE", payload: {
                    data: updatedQueue,
                    initialData: currentQueue?.initialData,
                    isShuffled: currentQueue?.isShuffled,
                    initialRandomQueue: currentQueue?.initialRandomQueue,
                    replayed: currentQueue?.replayed,
                    isPlayed: true
                }
            });
        }
    };

    const onClickRemove = async (e) => {
        e.stopPropagation();

        const index = number - 2;

        await currentQueue?.data?.splice(index, 1);

        let updatedInitialQueue = await currentQueue?.initialData?.filter((song) => {
            return song.index !== item.index;
        });

        let updatedInitialRandomQueue = [];
        if (currentQueue?.isShuffled) {
            updatedInitialRandomQueue = await currentQueue?.initialRandomQueue?.filter((song) => {
                return song.index !== item.index;
            });
        }

        if (updatedInitialQueue.length === 0) {
            // Update queue
            await dispatchQueue({
                type: "SET_CURRENTQUEUE", payload: {
                    data: currentQueue?.data,
                    initialData: updatedInitialQueue,
                    isShuffled: false,
                    initialRandomQueue: null,
                    replayed: 0,
                    isPlayed: currentQueue?.isPlayed
                }
            });
        } else {
            // Update queue
            await dispatchQueue({
                type: "SET_CURRENTQUEUE", payload: {
                    data: currentQueue?.data,
                    initialData: updatedInitialQueue,
                    isShuffled: currentQueue?.isShuffled,
                    initialRandomQueue: !updatedInitialRandomQueue ? currentQueue?.initialRandomQueue : updatedInitialRandomQueue,
                    replayed: currentQueue?.replayed,
                    isPlayed: currentQueue?.isPlayed
                }
            });
        }
    };

    return (
        <div className="queue-item" onClick={() => { isTouchDevice && handleOnClickPlay() }}>
            <div className="left">
                <span className="number">{number}</span>
                {played
                    ? <PauseRoundedIcon
                        onClick={handleOnClickPlay}
                        className="icon pause"
                    />
                    : <PlayArrowRoundedIcon
                        onClick={handleOnClickPlay}
                        className="icon play"
                    />}
            </div>
            <div className="middle">
                <div className="img-wrapper">
                    <img src={item?.value?.album[0]?.images[0] || item?.value?.album?.images[0]} alt={item?.value?.name} />
                </div>
                <div className="song-info">
                    <h4 className="name">
                        {!isTouchDevice
                            ? <Link
                                to={`/albums/${item?.value?.album[0]?._id || item?.value?.album?._id}`}
                                state={{ title: item?.value?.album[0]?.name || item?.value?.album?.name }}
                            >
                                {item?.value?.name}
                            </Link>
                            : item?.value?.name}
                    </h4>
                    <div className="artists">
                        {item?.value?.artists?.map((artist, index) => (
                            <React.Fragment key={artist._id}>
                                <span>
                                    {isTouchDevice
                                        ? artist.name
                                        :
                                        <Link
                                            to={`/artists/${artist._id}`}
                                            state={{ name: artist.name }}
                                        >
                                            {artist.name}
                                        </Link>
                                    }
                                </span>
                                {index < item?.value?.artists?.length - 1 &&
                                    <span className="comma">, </span>
                                }
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
            <div className="right">
                <div className="first">
                    <span className="text">{formatDuration(item?.value?.duration_ms)}</span>
                    <LikeButton custom={true} type="song" itemId={item?.value?._id} />
                </div>
                <div className="second">
                    {(number - 1) === 0
                        ? currentQueue?.isPlayed && <MusicWave />
                        : currentQueue?.initialData?.length > 0 &&
                        <Tooltip title="Xóa khỏi hàng đợi">
                            <RemoveCircleOutlineIcon className="icon remove" onClick={onClickRemove} />
                        </Tooltip>
                    }
                </div>
            </div>
        </div>
    )
}
