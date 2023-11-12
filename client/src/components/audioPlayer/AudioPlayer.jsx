import "./audioPlayer.scss";
import ReplayIcon from '@mui/icons-material/Replay';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRoundedIcon from '@mui/icons-material/VolumeDownRounded';
import VolumeMuteRoundedIcon from '@mui/icons-material/VolumeMuteRounded';
import MicExternalOnIcon from '@mui/icons-material/MicExternalOn';
import Slider from '@mui/material/Slider';
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Divider, Popper, Skeleton, Slide, Tooltip } from "@mui/material";
import QueueItem from "../queueItem/QueueItem";
import More from "../more/More";
import { AudioPlayerContext } from "../../context/AudioPlayerContext";
import useFetch from "../../hooks/useFetch";
import { AuthContext } from "../../context/AuthContext";
import { QueueContext } from "../../context/QueueContext";
import LikeButton from "../buttons/likeButton/LikeButton";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import axios from "axios";
import CustomSnackbar from "../customSnackbar/CustomSnackbar";
import LoginPopover from "../loginPopover/LoginPopover";

export default function AudioPlayer() {
    const { player, dispatch: dispatchAudio } = useContext(AudioPlayerContext);
    const audioRef = useRef();
    const [duration, setDuration] = useState(0); // Seconds  
    const { user } = useContext(AuthContext);
    const { data } = useFetch("/songs/top/popular?limit=5");
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    useEffect(() => {
        if (!player) {
            if (data.length > 0) {
                dispatchAudio({
                    type: "SET_PLAYER", payload: {
                        currentSong: { value: data[0], index: 0, type: null, itemId: null },
                    }
                });
            }
        }
    }, [player, data, dispatchAudio]);

    const { currentQueue, dispatch: dispatchQueue } = useContext(QueueContext);

    useEffect(() => {
        if (!currentQueue) {
            if (data?.length > 0) {
                const initialArray = data?.map((item, index) => {
                    return { value: item, index: index, type: null, itemId: null };
                });

                const array = initialArray?.filter((item, index) => {
                    return index > 0;
                });

                dispatchQueue({
                    type: "SET_CURRENTQUEUE", payload: {
                        data: array,
                        initialData: initialArray,
                        isShuffled: false,
                        initialRandomQueue: null,
                        replayed: 0,
                        isPlayed: false
                    }
                });
            }
        }
    }, [currentQueue, dispatchQueue, data, user]);

    const [countRender, setCountRender] = useState(0);
    useEffect(() => {
        if (audioRef?.current?.currentTime !== 0) {
            audioRef.current.currentTime = 0;
        }

        const count = countRender + 1;
        setCountRender(count);
        if (countRender !== 0 && user) {
            const type = player?.currentSong?.type;
            if (type !== "library") {
                let itemModel = "";
                if (type === "album") {
                    itemModel = "Album";
                } else if (type === "artist") {
                    itemModel = "Artist";
                } else if (type === "playlist") {
                    itemModel = "Playlist";
                } else if (type === "song") {
                    itemModel = "Song";
                }
                try {
                    const addCurrentlyPlayed = async () => {
                        await axios.put("/me/currently-played/" + player?.currentSong?.itemId, {
                            itemModel: itemModel
                        });
                    };
                    addCurrentlyPlayed();
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }, [player?.currentSong?.itemId]);

    useEffect(() => {
        if (currentQueue?.isPlayed && audioRef?.current?.paused) {
            audioRef?.current?.play();
        }
    }, [player?.currentSong]);

    const [valueVolume, setValueVolume] = useState(100);
    const [muted, setMuted] = useState(false);
    const [position, setPosition] = useState(0);
    const [openedQueue, setOpenedQueue] = useState(false);
    const [openedLyrics, setOpenedLyrics] = useState(false);
    const navigate = useNavigate();
    const anchorEl = useRef();

    useEffect(() => {
        const time = (player?.currentSong?.value?.duration_ms) / 1000;
        setDuration(time);
    }, [player]);

    const handleOnTimeUpdate = () => {
        if (isChanged) {
            return;
        }

        const updatePosition = () => {
            if (audioRef) {
                setPosition(Math.floor(audioRef.current.currentTime));
            } else {
                setPosition(0);
            }
        };
        updatePosition();
    };

    const [isChanged, setIsChanged] = useState(false);
    const handleOnChange = (value) => {
        setPosition(value);
        setIsChanged(true);
    };

    const handleOnChangeCommitted = () => {
        audioRef.current.currentTime = position;
        setIsChanged(false);
    };

    const handleOnEnded = async () => {
        if (currentQueue?.replayed === 2) {
            audioRef.current.currentTime = 0;
            return audioRef.current.play();
        }
        if (currentQueue?.data?.length > 1) {
            playNextSong();
        } else {
            // Update queue (isPlayed = false)
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
    };

    const formatDuration = (value) => {
        const minute = Math.floor(value / 60);
        const secondLeft = Math.floor((value - minute * 60));
        return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
    };

    // Before the browser closed
    window.addEventListener("beforeunload", function () {
        // If audio is still playing => turn off 
        if (currentQueue?.isPlayed) {
            dispatchQueue({
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
    });

    useEffect(() => {
        if (currentQueue?.isPlayed) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [audioRef, currentQueue?.isPlayed]);

    useEffect(() => {
        const value = valueVolume / 100;
        if (muted) {
            audioRef.current.volume = 0;
        } else {
            audioRef.current.volume = value;
        }
    }, [valueVolume, muted]);

    const handleOnClickPlay = async () => {
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
    };

    const playNextSong = async () => {
        if (currentQueue?.replayed === 0 && currentQueue?.data?.length === 0) {
            return;
        }

        // Update audio
        await dispatchAudio({
            type: "SET_PLAYER", payload: {
                currentSong: currentQueue?.data[0] || currentQueue?.initialData[0],
            }
        });

        // Remove the current song in queue
        let updatedQueue = await currentQueue?.data?.filter((item, index) => {
            return index > 0;
        });

        if (currentQueue?.replayed === 1) {
            let initialQueue = [];
            if (currentQueue?.isShuffled) {
                initialQueue = [...currentQueue?.initialRandomQueue];
            } else {
                initialQueue = [...currentQueue?.initialData];
            }

            if (updatedQueue?.length <= (initialQueue?.length - 1)) {
                updatedQueue = updatedQueue.concat(initialQueue);
            }
        }

        // Update queue
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

        audioRef?.current?.play()
            .catch((error) => {
                if (error) {
                    audioRef?.current?.play();
                }
            });
    };

    const playPrevSong = async () => {
        if ((currentQueue?.initialData?.length - 1) === currentQueue?.data?.length) {
            return;
        }
        // Get initial queue
        let initialQueue = [];
        // Get index of current song
        let indexCurSong = null;

        if (currentQueue?.isShuffled) {
            const lengthRandomQueue = currentQueue?.initialRandomQueue?.length;
            const lengthCurQueue = currentQueue?.data?.length;
            if (currentQueue?.replayed === 1) {
                indexCurSong = lengthRandomQueue * 2 - lengthCurQueue - 1;
            } else {
                indexCurSong = lengthRandomQueue - lengthCurQueue - 1;
            }
            initialQueue = [...currentQueue?.initialRandomQueue];
        }
        else {
            indexCurSong = player?.currentSong?.index;
            initialQueue = [...currentQueue?.initialData];
        }

        // Get index of prev song
        let indexPrevSong = indexCurSong - 1;

        // If not replay all songs
        if (currentQueue?.replayed === 0) {
            // If current song is the first song in initial queue
            if (indexPrevSong < 0) {
                return;
            }
        }

        let index = indexPrevSong;
        if (indexPrevSong < 0) {
            // Index of the last child in initial queue
            index = initialQueue?.length - 1;
        }

        const prevSong = initialQueue[index];

        if (indexPrevSong < 0) {
            currentQueue.data = initialQueue;
        } else {
            // Add current song to queue
            await currentQueue?.data?.unshift(player?.currentSong);
        }
        // Update queue
        await dispatchQueue({
            type: "SET_CURRENTQUEUE", payload: {
                data: currentQueue?.data,
                initialData: currentQueue?.initialData,
                isShuffled: currentQueue?.isShuffled,
                initialRandomQueue: currentQueue?.initialRandomQueue,
                replayed: currentQueue?.replayed,
                isPlayed: true
            }
        });

        // Update audio
        await dispatchAudio({
            type: "SET_PLAYER", payload: {
                currentSong: prevSong,
            }
        });

        audioRef.current.play();
    };

    const setReplayQueue = async (newReplayed) => {
        // If loop current song
        if (newReplayed === 2) {
            // Update queue
            await dispatchQueue({
                type: "SET_CURRENTQUEUE", payload: {
                    data: currentQueue?.data,
                    initialData: currentQueue?.initialData,
                    isShuffled: currentQueue?.isShuffled,
                    initialRandomQueue: currentQueue?.initialRandomQueue,
                    replayed: newReplayed,
                    isPlayed: currentQueue?.isPlayed
                }
            });
            return;
        }

        // Get initial queue
        let initialQueue = [];
        // Get index of current song
        let indexCurSong = null;
        // Get all songs after current song
        let afterSong = [];

        // If is shuffled
        if (currentQueue?.isShuffled) {
            const lengthRandomQueue = currentQueue?.initialRandomQueue?.length;
            const lengthCurQueue = currentQueue?.data?.length;
            // If not replay
            if (newReplayed === 0) {
                indexCurSong = lengthRandomQueue * 2 - lengthCurQueue - 1;
            }
            // If replay
            else {
                indexCurSong = lengthRandomQueue - lengthCurQueue - 1;
            }
            initialQueue = [...currentQueue?.initialRandomQueue];

            afterSong = initialQueue.filter((item, index) => {
                return index > indexCurSong;
            });
        }
        else {
            indexCurSong = player?.currentSong?.index;
            initialQueue = [...currentQueue?.initialData];

            afterSong = initialQueue.filter((item, index) => {
                return item.index > indexCurSong;
            });
        }

        if (newReplayed === 1) {
            // Push initial queue to afterSong
            initialQueue.forEach(item => {
                afterSong?.push(item);
            });
        }

        // Update queue
        await dispatchQueue({
            type: "SET_CURRENTQUEUE", payload: {
                data: afterSong,
                initialData: currentQueue?.initialData,
                isShuffled: currentQueue?.isShuffled,
                initialRandomQueue: currentQueue?.initialRandomQueue,
                replayed: newReplayed,
                isPlayed: currentQueue?.isPlayed
            }
        });
    };

    const handleOnClickReplay = () => {
        if (currentQueue?.initialData?.length === 0) {
            return;
        }

        const newReplayed = currentQueue?.replayed === 2 ? 0 : currentQueue?.replayed + 1;
        setReplayQueue(newReplayed);
    };

    const shuffle = (array) => {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex > 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    };

    const handleOnClickShuffle = () => {
        if (currentQueue?.initialData?.length === 0) {
            return;
        }

        if (!currentQueue?.isShuffled) {
            // Index of current song in queue
            const indexFilterItem = player?.currentSong?.index;
            // Get initial queue
            const tempQueue = [...currentQueue?.initialData];
            // Get all songs before current song
            const beforeCurrent = tempQueue?.filter((item) => {
                return item.index < indexFilterItem;
            });
            // Get all songs after current song
            const afterCurrent = tempQueue?.filter((item) => {
                return item.index > indexFilterItem;
            });
            // Combine 2 array
            const beforeAndAfter = beforeCurrent.concat(afterCurrent);
            // Shuffle 
            let shuffleQueue = shuffle(beforeAndAfter);
            let queue = [...shuffleQueue];

            if (currentQueue?.initialData?.includes(player?.currentSong)) {
                // Add current song to top
                shuffleQueue.unshift(player?.currentSong);

                queue = shuffleQueue.filter((item, index) => {
                    return index > 0;
                });
            }

            if (currentQueue?.replayed === 1) {
                // Double shuffle queue
                queue = queue.concat(shuffleQueue);
            }

            // Update queue
            dispatchQueue({
                type: "SET_CURRENTQUEUE", payload: {
                    data: queue,
                    initialData: currentQueue?.initialData,
                    isShuffled: true,
                    initialRandomQueue: shuffleQueue,
                    replayed: currentQueue?.replayed,
                    isPlayed: currentQueue?.isPlayed
                }
            });
        }
        else {
            // Get initial queue
            const initialQueue = [...currentQueue?.initialData];
            // Get all songs after current song (included current song)
            const afterSong = initialQueue?.filter((item) => {
                return item.index > player?.currentSong?.index;
            });
            if (currentQueue?.replayed === 1) {
                // Push initial queue to afterSong
                initialQueue?.forEach(item => {
                    afterSong.push(item);
                });
            }

            dispatchQueue({
                type: "SET_CURRENTQUEUE", payload: {
                    data: afterSong,
                    initialData: currentQueue?.initialData,
                    isShuffled: false,
                    initialRandomQueue: null,
                    replayed: currentQueue?.replayed,
                    isPlayed: currentQueue?.isPlayed
                }
            });
        }
    };

    // LYRICS
    const location = useLocation();
    const currentPath = decodeURIComponent(location.pathname);
    const page = currentPath.split("/")[1];

    useEffect(() => {
        if (page !== "lyrics") {
            setOpenedLyrics(false);
        } else {
            setOpenedLyrics(true);
        }
    }, [page]);

    const handleOnClickMic = () => {
        if (openedLyrics) {
            navigate(-1);
        } else {
            navigate("/lyrics/1");
        }
    };

    const [openLogin, setOpenLogin] = useState(false);
    const anchorRef = useRef();

    return (
        <div className="audio-player" ref={anchorEl}>
            <div className="audio-player-wrapper">
                <div className="left">
                    <div className="img-wrapper">
                        {!player?.currentSong
                            ?
                            <Skeleton variant="rounded" className="skeleton" />
                            :
                            <img
                                src={player?.currentSong?.value?.album[0]?.images[0] || player?.currentSong?.value?.album?.images[0]}
                                alt="Song"
                            />
                        }
                    </div>
                    <div className="song-info">
                        {!player?.currentSong
                            ?
                            <Skeleton variant="text" className="skeleton" width={100} />
                            :
                            <h4 className="name">
                                <Link
                                    to={`/albums/${player?.currentSong?.value?.album[0]?._id || player?.currentSong?.value?.album?._id}`}
                                    state={{
                                        title: player?.currentSong?.value?.album[0]?.name || player?.currentSong?.value?.album?.name
                                    }}
                                >
                                    {player?.currentSong?.value?.name}
                                </Link>
                            </h4>
                        }
                        <div className="artists">
                            {!player?.currentSong
                                ?
                                <Skeleton variant="text" className="skeleton" width={130} />
                                : <>
                                    {player?.currentSong?.value?.artists?.map((artist, index) => (
                                        <React.Fragment key={artist._id}>
                                            <span>
                                                {isTouchDevice
                                                    ? artist.name
                                                    :
                                                    <Link
                                                        to={`/artists/${artist._id}`}
                                                        state={{
                                                            name: artist.name
                                                        }}
                                                    >
                                                        {artist.name}
                                                    </Link>
                                                }
                                            </span>
                                            {index < player?.currentSong?.value?.artists?.length - 1 &&
                                                <span className="comma">, </span>
                                            }
                                        </React.Fragment>
                                    ))}
                                </>}
                        </div>
                    </div>

                    <LikeButton
                        custom={true}
                        type="song"
                        itemId={player?.currentSong?.value?._id}
                    />

                    <More
                        songs={[player?.currentSong?.value]}
                        img={player?.currentSong?.value?.album[0]?.images[0] || player?.currentSong?.value?.album?.images[0]}
                        album={player?.currentSong?.value?.album[0] || player?.currentSong?.value?.album}
                        artists={player?.currentSong?.value?.artists}
                        type="song"
                        itemId={player?.currentSong?.value?._id}
                    />
                </div>
                <div className="middle">
                    <div className="control-button">
                        <div className="replay-wrapper">
                            {currentQueue?.replayed === 2 &&
                                <div className="replay-all">
                                    <span className="replay-all-text">1</span>
                                </div>
                            }
                            <Tooltip
                                placement="top"
                                disableInteractive
                                title={currentQueue?.replayed === 1 ? "Phát lại một bài" : currentQueue?.replayed === 2 ? "Tắt phát lại" : "Phát lại tất cả"}
                            >
                                <ReplayIcon
                                    onClick={handleOnClickReplay}
                                    className={`icon replay ${currentQueue?.replayed !== 0 && "selected"}`}
                                />
                            </Tooltip>
                        </div>
                        <Tooltip title="Quay lại" placement="top" disableInteractive>
                            <SkipPreviousIcon
                                className="icon previous"
                                onClick={playPrevSong}
                            />
                        </Tooltip>
                        <div className="play-pause" onClick={handleOnClickPlay}>
                            {currentQueue?.isPlayed
                                ? <PauseCircleFilledIcon className="icon pause" />
                                : <PlayCircleFilledIcon className="icon play" />}
                        </div>
                        <Tooltip title="Bật bài tiếp theo" placement="top" disableInteractive>
                            <SkipNextIcon
                                className="icon next"
                                onClick={playNextSong}
                            />
                        </Tooltip>
                        <Tooltip title={currentQueue?.isShuffled ? "Tắt trộn bài" : "Trộn bài"} placement="top" disableInteractive>
                            <ShuffleIcon
                                onClick={handleOnClickShuffle}
                                className={`icon shuffle ${currentQueue?.isShuffled && "selected"}`}
                            />
                        </Tooltip>
                    </div>
                    <div className="control-timeline" >
                        <span className="time current">{formatDuration(position)}</span>
                        <Slider
                            aria-label="time-indicator"
                            value={position}
                            min={0}
                            step={1}
                            max={duration}
                            onChange={(_, value) => handleOnChange(value)}
                            onChangeCommitted={handleOnChangeCommitted}
                            className="slider"
                        />
                        <audio
                            src={player?.currentSong?.value?.audio}
                            ref={audioRef}
                            onEnded={handleOnEnded}
                            onTimeUpdate={handleOnTimeUpdate}
                        ></audio>
                        <span className="time duration">{duration ? formatDuration(duration) : "0:00"}</span>
                    </div>
                </div>
                <div className="right">
                    <Tooltip title="Tải xuống" disableInteractive>
                        <FileDownloadIcon
                            className="icon download"
                            ref={anchorRef}
                            onClick={() => !user && setOpenLogin(!openLogin)}
                        />
                    </Tooltip>
                    <LoginPopover
                        open={openLogin}
                        setOpen={setOpenLogin}
                        anchorEl={anchorRef?.current}
                        title="Tải bài hát"
                        content="Hãy đăng nhập để được trải nghiệm tính năng này."
                    />
                    <Divider orientation="vertical" flexItem className="divider" />
                    <Tooltip title={openedLyrics ? "Tắt lời bài hát" : "Xem lời bài hát"} disableInteractive>
                        <MicExternalOnIcon
                            onClick={handleOnClickMic}
                            className={`icon lyrics ${openedLyrics && "selected"}`}
                        />
                    </Tooltip>
                    <Tooltip title={openedQueue ? "Tắt hàng đợi" : "Xem hàng đợi"} disableInteractive>
                        <QueueMusicIcon
                            onClick={() => setOpenedQueue(!openedQueue)}
                            className={`icon queue ${openedQueue && "selected"}`}
                        />
                    </Tooltip>
                    <div className="volume-wrapper">
                        {valueVolume >= 50 && !muted
                            ? <VolumeUpRoundedIcon
                                className="icon volume"
                                onClick={() => setMuted(!muted)}
                            />
                            : valueVolume > 0 && valueVolume < 50 && !muted
                                ? <VolumeDownRoundedIcon
                                    className="icon volume"
                                    onClick={() => setMuted(!muted)}
                                />
                                : <VolumeMuteRoundedIcon
                                    className="icon volume"
                                    onClick={() => setMuted(!muted)}
                                />}
                        <Slider
                            aria-label="Volume"
                            value={muted ? 0 : valueVolume}
                            onChange={(_, value) => setValueVolume(value)}
                            onClick={() => { muted && setMuted(!muted) }}
                            valueLabelDisplay="auto"
                            className="volume-control"
                        />
                    </div>
                </div>
            </div>
            <Popper
                open={openedQueue}
                anchorEl={anchorEl.current}
                role={undefined}
                transition
                disablePortal
                placement="top-end"
                modifiers={[
                    {
                        name: "preventOverflow",
                        enabled: true,
                        // escapeWithReference: true,
                        // boundariesElement: 'viewport'
                    }
                ]}
            >
                {({ TransitionProps }) => (
                    <Slide {...TransitionProps} direction="left" >
                        <div className="queue-list">
                            <h4 className="title">Hàng đợi</h4>

                            <p className="item-type-text">Đang phát</p>
                            <QueueItem
                                played={currentQueue?.isPlayed}
                                item={player?.currentSong}
                                number={1}
                            />

                            <Divider className="divider" />
                            {currentQueue?.data?.length > 0
                                ? <>
                                    <p className="item-type-text">Tiếp theo</p>
                                    {
                                        currentQueue?.data?.map((item, index) => (
                                            <QueueItem
                                                key={index}
                                                played={false}
                                                item={item}
                                                number={index + 2}
                                                user={user}
                                            />
                                        ))
                                    }
                                </>
                                : <>
                                    <p className="no-item-text">Không có bài nào để nghe tiếp...</p>
                                </>
                            }
                        </div>
                    </Slide>
                )}
            </Popper>
        </div>
    )
}
