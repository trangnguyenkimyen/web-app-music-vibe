import "./audioPlayer.scss";
import songImg from "../../images/song/forgetmenow.jpg";
import PlayIcon from "../../images/playButton.svg";
import PauseIcon from "../../images/pauseButton.svg";
import audioSrc from "../../audio/Forget-Me-Now-fishy-Tri-Dung.mp3";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
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
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Divider, IconButton, Slide, Tooltip } from "@mui/material";
import QueueItem from "../queueItem/QueueItem";
import More from "../more/More";

export default function AudioPlayer() {
    const [liked, setLiked] = useState(false);
    const [played, setPlayed] = useState(false);
    const [shuffled, setShuffled] = useState(false);
    let [replayed, setReplayed] = useState(0);
    const [valueVolume, setValueVolume] = useState(100);
    const [muted, setMuted] = useState(false);
    const [position, setPosition] = useState(0);
    const [openedQueue, setOpenedQueue] = useState(false);
    const [openedLyrics, setOpenedLyrics] = useState(false);
    const duration = 197; // Seconds  
    const audioRef = useRef();
    const animationRef = useRef();
    const [renderCount, setRenderCount] = useState(0);
    const navigate = useNavigate();

    const startTimer = () => {
        cancelAnimationFrame(animationRef.current);

        const updatePosition = () => {
            if (audioRef && audioRef.current.ended) {
                setPlayed(false);
            } else if (audioRef) {
                setPosition(Math.floor(audioRef.current.currentTime));
            } else {
                setPosition(0);
            }
            // Call itself => loop
            animationRef.current = requestAnimationFrame(updatePosition);
        };

        // Call updatePosition function, first time played
        animationRef.current = requestAnimationFrame(updatePosition);
    };

    const formatDuration = (value) => {
        const minute = Math.floor(value / 60);
        const secondLeft = value - minute * 60;
        return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
    };

    const handleReplay = () => {
        if (replayed === 2) {
            return setReplayed(0);
        }
        setReplayed(++replayed);
    };

    useEffect(() => {
        if (played) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
            cancelAnimationFrame(animationRef.current);
        }
    }, [audioRef, played]);

    useEffect(() => {
        played && startTimer();
    }, [played]);

    useEffect(() => {
        const value = valueVolume / 100;
        if (muted) {
            audioRef.current.volume = 0;
        } else {
            audioRef.current.volume = value;
        }
    }, [valueVolume, muted]);

    const decreaseVolume = useCallback(() => {
        if (audioRef.current.volume > 0) {
            const newVolume = audioRef.current.volume - 0.1;
            if (newVolume <= 0) {
                audioRef.current.volume = 0;
            } else {
                audioRef.current.volume = newVolume;
                requestAnimationFrame(decreaseVolume);
            }
        }
    }, []);

    const increaseVolume = useCallback(() => {
        const value = valueVolume / 100;
        if (muted) {
            return;
        }
        if (audioRef.current.volume < value) {
            const newVolume = audioRef.current.volume + 0.1;
            if (newVolume >= value) {
                audioRef.current.volume = value;
            } else {
                audioRef.current.volume = newVolume;
                requestAnimationFrame(increaseVolume);
            }
        }
    }, [muted, valueVolume]);

    useEffect(() => {
        if (renderCount === 0) {
            setRenderCount(1);
            return;
        }
        if (!played) {
            decreaseVolume();
        } else {
            increaseVolume();
        }
    }, [played, decreaseVolume, increaseVolume, renderCount]);

    const handleOnChange = (value) => {
        cancelAnimationFrame(animationRef.current); // Cancel to stop setPosition
        setPosition(value);
    };

    const handleOnChangeCommitted = () => {
        audioRef.current.currentTime = position;
        startTimer();
    };

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

    const handleOnclickMic = () => {
        if (openedLyrics) {
            navigate(-1);
        } else {
            navigate("/lyrics/1");
        }
    }

    return (
        <div className="audio-player">
            <div className="audio-player-wrapper">
                <div className="left">
                    <div className="img-wrapper">
                        <img src={songImg} alt="Song" />
                    </div>
                    <div className="song-info">
                        <Link to="/albums/1">
                            <h4 className="name">Forget me now</h4>
                        </Link>
                        <div className="artists">
                            <Link to="/artists/1">
                                <span>Artist 1</span>
                            </Link>
                            <span className="comma">, </span>
                            <Link to="/artists/2">
                                <span>Artist 2</span>
                            </Link>
                        </div>
                    </div>
                    <Tooltip title={liked ? "Xóa khỏi thư viện" : "Thêm vào thư viện"} disableInteractive>
                        <IconButton className={`button ${liked && "liked"}`} onClick={() => setLiked(!liked)}>
                            {liked
                                ? <FavoriteIcon className="audio-player-icon like" />
                                : <FavoriteBorderOutlinedIcon className="audio-player-icon like" />}
                        </IconButton>
                    </Tooltip>
                    <More />
                </div>
                <div className="middle">
                    <div className="control-button">
                        <div className="replay-wrapper">
                            {replayed === 2 &&
                                <div className="replay-all">
                                    <span className="replay-all-text">1</span>
                                </div>
                            }
                            <Tooltip
                                placement="top"
                                disableInteractive
                                title={replayed === 1 ? "Phát lại một bài" : replayed === 2 ? "Tắt phát lại" : "Phát lại tất cả"}
                            >
                                <ReplayIcon
                                    onClick={handleReplay}
                                    className={`icon replay ${replayed !== 0 && "selected"}`}
                                />
                            </Tooltip>
                        </div>
                        <Tooltip title="Quay lại" placement="top" disableInteractive>
                            <SkipPreviousIcon className="icon previous" />
                        </Tooltip>
                        <Tooltip title={played ? "Dừng" : "Phát"} placement="top" disableInteractive>
                            <img
                                src={!played ? PlayIcon : PauseIcon}
                                alt={!played ? "Play Icon" : "Pause Icon"}
                                onClick={() => setPlayed(!played)}
                                className="play-pause"
                            />
                        </Tooltip>
                        <Tooltip title="Bật bài tiếp theo" placement="top" disableInteractive>
                            <SkipNextIcon className="icon next" />
                        </Tooltip>
                        <Tooltip title={shuffled ? "Tắt trộn bài" : "Trộn bài"} placement="top" disableInteractive>
                            <ShuffleIcon
                                onClick={() => setShuffled(!shuffled)}
                                className={`icon shuffle ${shuffled && "selected"}`}
                            />
                        </Tooltip>
                    </div>
                    <div className="control-timeline">
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
                        <audio src={audioSrc} ref={audioRef}></audio>
                        <span className="time duration">{formatDuration(duration)}</span>
                    </div>
                </div>
                <div className="right">
                    <Tooltip title="Tải xuống" disableInteractive>
                        <FileDownloadIcon className="icon download" />
                    </Tooltip>
                    <Divider orientation="vertical" flexItem className="divider" />
                    <Tooltip title={openedLyrics ? "Tắt lời bài hát" : "Xem lời bài hát"} disableInteractive>
                        <MicExternalOnIcon
                            onClick={handleOnclickMic}
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
            <Slide direction="left" in={openedQueue} mountOnEnter unmountOnExit>
                <div className="queue-list">
                    <h4 className="title">Hàng đợi</h4>
                    <p className="item-type-text">Đang phát</p>
                    <QueueItem
                        played={played}
                        setPlayed={setPlayed}
                        liked={liked}
                        setLiked={setLiked}
                    />

                    <Divider className="divider" />

                    <p className="item-type-text">Tiếp theo</p>
                    <QueueItem
                        played={false}
                        liked={false}
                    />
                    <QueueItem
                        played={false}
                        liked={false}
                    />
                    <QueueItem
                        played={false}
                        liked={false}
                    />
                </div>
            </Slide>
        </div>
    )
}
