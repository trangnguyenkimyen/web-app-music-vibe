import "./followArtistButton.scss";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from "react";
import { Tooltip } from "@mui/material";

export default function FollowArtistButton({ isFollowed }) {
    const [followed, setFollowed] = useState(isFollowed);

    return (
        <Tooltip title={followed ? "Bỏ theo dõi" : "Theo dõi"} disableInteractive>
            <div className="follow-button">
                <div className="wrapper" onClick={() => setFollowed(!followed)}>
                    {followed
                        ? <FavoriteIcon className="icon followed" />
                        : <FavoriteBorderIcon className="icon unfollowed" />
                    }
                </div>
            </div>
        </Tooltip>
    )
}
