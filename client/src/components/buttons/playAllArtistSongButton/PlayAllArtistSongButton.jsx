import "./playAllArtistSongButton.scss";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

export default function PlayAllArtistSongsButton() {
    return (
        <div className="play-button">
            <button>
                <PlayCircleIcon className="icon play" />
                Phát tất cả bài hát
            </button>
        </div>
    )
}
