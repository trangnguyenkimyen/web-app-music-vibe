import { useEffect, useState } from "react";
import "./home.scss";
import Carousel from 'react-material-ui-carousel';
import img1 from "../../images/artist/den.jpg";
import img2 from "../../images/artist/amee.jpg";
import img3 from "../../images/artist/obito.jpg";
import img4 from "../../images/artist/bray.jpg";
import img5 from "../../images/artist/sunihalinh.jpg";
import mic from "../../images/mic-icon.svg";
import headphone from "../../images/headphone-icon.svg";
import SongItem from "../../components/songItem/SongItem";
import Card from "../../components/card/Card";
import { Link } from "react-router-dom";
import ArtistItem from "../../components/artistItem/ArtistItem";

export default function Home() {
    const imgArray = [img1, img2, img3, img4, img5];
    const [curSong, setCurSong] = useState(null);

    useEffect(() => {
        document.title = "vibe - Trang chủ";
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
                        <Carousel>
                            {imgArray.map((img) => (
                                <ArtistItem img={img} isFollowed={false} />
                            ))}
                        </Carousel>
                    </div>
                    <div className="top-songs">
                        <div className="title">
                            <h3 className="title-text">Thiên hạ nghe gì?</h3>
                            <img src={headphone} alt="Icon micro" className="micro" />
                        </div>
                        <div className="songs">
                            <SongItem isLiked={false} curSong={curSong} idSong="1" setCurSong={setCurSong} />
                            <SongItem isLiked={false} curSong={curSong} idSong="2" setCurSong={setCurSong} />
                            <SongItem isLiked={false} curSong={curSong} idSong="3" setCurSong={setCurSong} />
                            <SongItem isLiked={false} curSong={curSong} idSong="4" setCurSong={setCurSong} />
                            <SongItem isLiked={false} curSong={curSong} idSong="5" setCurSong={setCurSong} />
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <section>
                        <div className="title">
                            <h3 className="title-text">Gần đây</h3>
                            <Link to="/section/Gần đây">
                                <p className="more">Xem thêm</p>
                            </Link>
                        </div>
                        <div className="cards">
                            {[...Array(2)].map((_, index) => (
                                <div className="wrapper-item">
                                    <div className="item">
                                        <Link to={`/artists/${index}`}>
                                            <Card key={index} type="artist" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            {[...Array(3)].map((_, index) => (
                                <div className="wrapper-item">
                                    <div className="item">
                                        <Link to={`/albums/${index}`}>
                                            <Card key={index} type="album" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <div className="title">
                            <h3 className="title-text">Playlist dành cho bạn</h3>
                            <Link to="/section/Playlist dành cho bạn">
                                <p className="more">Xem thêm</p>
                            </Link>
                        </div>
                        <div className="cards">
                            {[...Array(5)].map((_, index) => (
                                <div className="wrapper-item">
                                    <div className="item">
                                        <Link to={`/playlists/${index}`}>
                                            <Card key={index} type="playlist" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <div className="title">
                            <h3 className="title-text">Nghệ sĩ bạn yêu thích</h3>
                            <Link to="/section/Nghệ sĩ bạn yêu thích">
                                <p className="more">Xem thêm</p>
                            </Link>
                        </div>
                        <div className="cards">
                            {[...Array(5)].map((_, index) => (
                                <div className="wrapper-item">
                                    <div className="item">
                                        <Link to={`/artists/${index}`}>
                                            <Card key={index} type="artist" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <div className="title">
                            <h3 className="title-text">Nghệ sĩ được đề xuất</h3>
                            <Link to="/section/Nghệ sĩ được đề xuất">
                                <p className="more">Xem thêm</p>
                            </Link>
                        </div>
                        <div className="cards">
                            {[...Array(5)].map((_, index) => (
                                <div className="wrapper-item">
                                    <div className="item">
                                        <Link to={`/artists/${index}`}>
                                            <Card key={index} type="artist" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <div className="title">
                            <h3 className="title-text">Có thể bạn sẽ thích</h3>
                            <Link to="/section/Có thể bạn sẽ thích">
                                <p className="more">Xem thêm</p>
                            </Link>
                        </div>
                        <div className="cards">
                            {[...Array(5)].map((_, index) => (
                                <div className="wrapper-item">
                                    <div className="item">
                                        <Link to={`/albums/${index}`}>
                                            <Card key={index} type="album" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <div className="title">
                            <h3 className="title-text">Playlist phổ biến</h3>
                            <Link to="/section/Playlist phổ biến">
                                <p className="more">Xem thêm</p>
                            </Link>
                        </div>
                        <div className="cards">
                            {[...Array(5)].map((_, index) => (
                                <div className="wrapper-item">
                                    <div className="item">
                                        <Link to={`/playlists/${index}`}>
                                            <Card key={index} type="playlist" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <div className="title">
                            <h3 className="title-text">Mood</h3>
                            <Link to="/section/Mood">
                                <p className="more">Xem thêm</p>
                            </Link>
                        </div>
                        <div className="cards">
                            {[...Array(5)].map((_, index) => (
                                <div className="wrapper-item">
                                    <div className="item">
                                        <Link to={`/playlists/${index}`}>
                                            <Card key={index} type="playlist" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <div className="title">
                            <h3 className="title-text">Mới phát hành</h3>
                            <Link to="/section/Mới phát hành">
                                <p className="more">Xem thêm</p>
                            </Link>
                        </div>
                        <div className="cards">
                            {[...Array(5)].map((_, index) => (
                                <div className="wrapper-item">
                                    <div className="item">
                                        <Link to={`/albums/${index}`}>
                                            <Card key={index} type="album" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <div className="title">
                            <h3 className="title-text">Album phổ biến</h3>
                            <Link to="/section/Album phổ biến">
                                <p className="more">Xem thêm</p>
                            </Link>
                        </div>
                        <div className="cards">
                            {[...Array(5)].map((_, index) => (
                                <div className="wrapper-item">
                                    <div className="item">
                                        <Link to={`/albums/${index}`}>
                                            <Card key={index} type="album" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <div className="title">
                            <h3 className="title-text">Được đề xuất bởi Vibe</h3>
                            <Link to="/section/Được đề xuất bởi Vibe">
                                <p className="more">Xem thêm</p>
                            </Link>
                        </div>
                        <div className="cards">
                            {[...Array(5)].map((_, index) => (
                                <div className="wrapper-item">
                                    <div className="item">
                                        <Link to={`/playlists/${index}`}>
                                            <Card key={index} type="playlist" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
