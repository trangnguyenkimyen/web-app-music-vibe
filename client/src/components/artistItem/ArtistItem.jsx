import { Link } from "react-router-dom";
import FollowArtistButton from "../buttons/followArtistButton/FollowArtistButton";
import PlayAllArtistSongButton from "../buttons/playAllArtistSongButton/PlayAllArtistSongButton";
import "./artistItem.scss";

export default function ArtistItem({ img, isFollowed }) {
    return (
        <div className="artist-item">
            <div className="img-wrapper">
                <img src={img} alt="" />
            </div>
            <div className="artist-info">
                <div className="artist-name">
                    <Link to="/artists/1">
                        Artist's name
                    </Link>
                </div>
                <div className="artist-listeners">
                    10,130,390 lượt nghe hàng tháng
                </div>
            </div>
            <PlayAllArtistSongButton />
            <FollowArtistButton isFollowed={isFollowed} />
        </div>
    )
}
