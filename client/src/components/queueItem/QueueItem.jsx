import "./queueItem.scss";
import songImg from "../../images/song/forgetmenow.jpg";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Tooltip } from "@mui/material";
import { withStyles } from "@mui/styles";

export default function QueueItem({ played, setPlayed, liked, setLiked }) {
    const CustomTooltip = withStyles(theme => ({
        tooltip: {
            zIndex: -1,
        },
    }))(Tooltip);
    return (
        <div className="queue-item">
            <div className="left">
                <span className="number">1</span>
                {played
                    ? <PauseRoundedIcon
                        onClick={() => setPlayed(!played)}
                        className="icon pause"
                    />
                    : <PlayArrowRoundedIcon
                        onClick={() => setPlayed(!played)}
                        className="icon play"
                    />}
            </div>
            <div className="middle">
                <div className="img-wrapper">
                    <img src={songImg} alt="Song" />
                </div>
                <div className="song-info">
                    <h4 className="name">Forget me now</h4>
                    <div className="artists">
                        <span>Artist 1</span>
                        <span className="comma">, </span>
                        <span>Artist 2</span>
                    </div>
                </div>
            </div>
            <div className="right">
                <div className="first">
                    <span className="text">3:15</span>
                    <CustomTooltip title={liked ? "Xóa khỏi thư viện" : "Thêm vào thư viện"} disableInteractive>
                        {liked
                            ? <FavoriteIcon
                                onClick={() => setLiked(!liked)}
                                className="icon unliked"
                            />
                            : <FavoriteBorderOutlinedIcon
                                onClick={() => setLiked(!liked)}
                                className="icon liked"
                            />}
                    </CustomTooltip>
                </div>
                <div className="second">
                    <Tooltip title="Xóa khỏi hàng đợi">
                        <RemoveCircleOutlineIcon className="icon remove" />
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}
