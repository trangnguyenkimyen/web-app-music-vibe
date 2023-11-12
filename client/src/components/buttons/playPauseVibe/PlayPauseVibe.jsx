import { useContext } from "react";
import "./playPauseVibe.scss";
import { AudioPlayerContext } from "../../../context/AudioPlayerContext";
import { QueueContext } from "../../../context/QueueContext";
import playButton from "../../../images/playButton.svg";
import pauseButton from "../../../images/pauseButton.svg";
import axios from "axios";

export default function PlayPauseVibe({ item, type }) {
    const { player, dispatch: dispatchAudio } = useContext(AudioPlayerContext);
    const { currentQueue, dispatch: dispatchQueue } = useContext(QueueContext);

    const handleOnClickButton = async (e) => {
        e.preventDefault();
        if (player?.currentSong?.itemId !== item?._id) {
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
                res = await axios.get(process.env.REACT_APP_API_URL + "/playlists/find/" + item?._id);
                data = res.data.songs;
            } else if (type === "album") {
                res = await axios.get(process.env.REACT_APP_API_URL + "/albums/find/" + item?._id);
                data = res.data.songs;
            } else if (type === "song") {
                res = await axios.get(process.env.REACT_APP_API_URL + "/songs/find/" + item?._id);
                data = [res.data];
            }
            else {
                res = await axios.get(process.env.REACT_APP_API_URL + "/artists/" + item?._id + "/top-songs?limit=10");
                data = res.data;
            }

            const initialArray = await data?.map((song, index) => {
                return { value: song, index: index, type: type, itemId: item?._id };
            });

            const array = await initialArray?.filter((item, index) => {
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
    }

    return (
        <div className="play-pause-vibe" onClick={handleOnClickButton}>
            <img
                src={player?.currentSong?.itemId === item?._id && currentQueue?.isPlayed
                    ? pauseButton
                    : playButton}
                alt={`Play/Pause button`}
            />
        </div>
    )
}
