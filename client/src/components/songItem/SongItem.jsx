import "./songItem.scss";
import HeadphonesIcon from '@mui/icons-material/Headphones';
import More from "../more/More";
import React, { useContext } from "react";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import { IconButton } from "@mui/material";
import MusicWave from "../musicWave/MusicWave";
import { Link } from "react-router-dom";
import { AudioPlayerContext } from "../../context/AudioPlayerContext";
import { QueueContext } from "../../context/QueueContext";
import LikeButton from "../buttons/likeButton/LikeButton";

export default function SongItem({ song }) {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    const { player, dispatch: dispatchAudio } = useContext(AudioPlayerContext);
    const { currentQueue, dispatch: dispatchQueue } = useContext(QueueContext);

    const handleOnClickPlay = async () => {
        if (player?.currentSong?.itemId !== song._id) {
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

            const data = [song];

            const initialArray = await data?.map((song, index) => {
                return { value: song, index: index, type: "song", itemId: song._id };
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
        <div
            className={`songItem ${player?.currentSong?.itemId === song._id && "played"}`}
            tabIndex="0"
            onClick={() => { isTouchDevice && handleOnClickPlay() }}
        >
            <div className="left">
                <div className="songItem-img">
                    <img src={song?.album[0]?.images[0] || song?.album?.images[0]} alt={song.name} />
                    {player?.currentSong?.itemId === song?._id && currentQueue?.isPlayed && <MusicWave />}
                    <IconButton className="button" onClick={handleOnClickPlay}>
                        {player?.currentSong?.itemId === song?._id && currentQueue?.isPlayed
                            ? <PauseRoundedIcon
                                className="icon pause"
                            />
                            : <PlayArrowRoundedIcon
                                className="icon play"
                            />}
                    </IconButton>
                </div>
                <div className="songItem-info">
                    <h4 className="name">
                        {isTouchDevice
                            ? song.name
                            :
                            <Link
                                to={`/albums/${song?.album[0]?._id}`}
                                state={{ title: song?.album[0]?.name }}
                            >
                                {song.name}
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
                                        <Link
                                            to={`/artists/${artist._id}`}
                                            state={{ title: artist.name }}
                                        >
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
            <div className="right">
                <LikeButton type="song" custom={true} itemId={song?._id} />
                <div className="listeners">
                    <span className="text">1,304K</span>
                    <HeadphonesIcon className="icon headphone" />
                </div>
                <More
                    album={song?.album[0]}
                    artists={song?.artists}
                    songs={[song]}
                    type="song"
                    itemId={song?._id}
                    img={song?.album[0]?.images[0]}
                />
            </div>
        </div>
    )
}
