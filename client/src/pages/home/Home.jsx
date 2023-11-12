import { useContext, useEffect } from "react";
import "./home.scss";
import Carousel from 'react-material-ui-carousel';
import mic from "../../images/mic-icon.svg";
import headphone from "../../images/headphone-icon.svg";
import SongItem from "../../components/songItem/SongItem";
import ArtistItem from "../../components/artistItem/ArtistItem";
import useFetch from "../../hooks/useFetch";
import { AuthContext } from "../../context/AuthContext";
import { Skeleton } from "@mui/material";
import Section from "../../components/section/Section";

export default function Home() {
    const { data: artistsData, loading: artistsLoading } = useFetch("/artists/top/popular?limit=5");
    const { data: songsData, loading: songsLoading } = useFetch("/songs/top/popular?limit=5");
    const { user } = useContext(AuthContext);

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    useEffect(() => {
        document.title = "vibe - Web App nghe nhạc trực tuyến";
    }, []);

    return (
        <div className="home">
            <div className="home-wrapper">
                <div className="top">
                    <div className="top-artists">
                        <div className="title">
                            <h3 className="title-text">Nghệ sĩ nổi bật</h3>
                            <img src={mic} alt="Icon micro" className="micro" />
                        </div>
                        {artistsLoading
                            ? <Skeleton variant="rounded" className="skeleton" height={300} />
                            :
                            <Carousel
                                navButtonsAlwaysVisible={isTouchDevice}
                                autoPlay={false}
                            >
                                {artistsData?.map((artist) => (
                                    <ArtistItem key={artist._id} artist={artist} />
                                ))}
                            </Carousel>
                        }
                    </div>
                    <div className="top-songs">
                        <div className="title">
                            <h3 className="title-text">Thiên hạ nghe gì?</h3>
                            <img src={headphone} alt="Icon micro" className="micro" />
                        </div>
                        <div className="songs">
                            {songsLoading
                                ? <>
                                    {[...Array(5)].map((_, index) => (
                                        <Skeleton key={index} variant="rounded" className="song-item skeleton" />
                                    ))}
                                </>
                                : <>
                                    {songsData?.map((song) => (
                                        <SongItem key={song._id} song={song} />
                                    ))}
                                </>}
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    {user &&
                        <>
                            <Section title="Gần đây" url={"/me/currently-played?limit="} />
                            <Section title="Nghệ sĩ bạn yêu thích" type="artist" url={"/me/following?type=artist&limit="} />
                            <Section title="Nghệ sĩ được đề xuất" type="artist" url={"/me/recommended-artists?limit="} />
                            <Section title="Có thể bạn sẽ thích" type="song" url={"/me/recommended-songs?limit="} />
                        </>}
                    <Section title="Playlist phổ biến" type="playlist" url={"/playlists/top/popular?limit="} />
                    <Section title="Mood" type="playlist" url={"/playlists/top/category?type=mood&limit="} />
                    <Section title="Mới phát hành" type="song" url={"/songs/top/new-released?limit="} />
                    <Section title="Album phổ biến" type="album" url={"/albums/top/popular?limit="} />
                    <Section title="Được đề xuất bởi Vibe" type="playlist" url={"/playlists/top/category?type=recommend&limit="} />
                </div>
            </div>
        </div>
    )
}
