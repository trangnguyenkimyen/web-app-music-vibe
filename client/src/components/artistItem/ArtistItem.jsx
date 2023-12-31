import { Link } from "react-router-dom";
import FollowButton from "../buttons/followButton/FollowButton";
import PlayAllArtistSongButton from "../buttons/playAllArtistSongButton/PlayAllArtistSongButton";
import "./artistItem.scss";
import { useEffect, useState } from "react";

export default function ArtistItem({ artist }) {
    const [img, setImg] = useState("");
    const fakePlays = 10120030 + artist.followersCount;

    useEffect(() => {
        if (artist) {
            const avatar = artist.images.find((img) => img.type === "avatar");
            setImg(avatar.src);
        }
    }, [artist]);

    return (
        <div className="artist-item">
            <div className="img-wrapper">
                <img src={img} alt="" />
            </div>
            <div className="artist-info">
                <div className="artist-name">
                    <Link
                        to={`/artists/${artist._id}`}
                        state={{ title: artist.name }}
                    >
                        {artist.name}
                    </Link>
                </div>
                <div className="artist-listeners">
                    {fakePlays.toLocaleString('en-US')} lượt nghe hàng tháng
                </div>
            </div>
            <PlayAllArtistSongButton id={artist._id} />
            <FollowButton id={artist._id} type="artist" />
        </div>
    )
}
