import { useContext } from "react";
import "./playAllArtistSongButton.scss";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { AudioPlayerContext } from "../../../context/AudioPlayerContext";
import { QueueContext } from "../../../context/QueueContext";
import axios from "axios";

export default function PlayAllArtistSongsButton({ id }) {
    const { player, dispatch: dispatchAudio } = useContext(AudioPlayerContext);
    const { currentQueue, dispatch: dispatchQueue } = useContext(QueueContext);

    const handleOnClickPlay = async () => {
        if (player?.currentSong?.itemId !== id) {
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

            const res = await axios.get("/artists/" + id + "/top-songs?limit=10");
            const data = res.data;

            const initialArray = await data?.map((song, index) => {
                return { value: song, index: index, type: "artist", itemId: id };
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
    };

    return (
        <div className="play-button">
            <button onClick={handleOnClickPlay} className={player?.currentSong?.itemId === id && currentQueue?.isPlayed ? "played" : ""}>
                {player?.currentSong?.itemId === id && currentQueue?.isPlayed
                    ? <PauseCircleIcon className="icon pause" />
                    : <PlayCircleIcon className="icon play" />
                }
                Phát tất cả bài hát
            </button>
        </div>
    )
}
