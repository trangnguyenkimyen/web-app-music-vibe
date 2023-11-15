import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./search.scss";
import { Chip, CircularProgress, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import PlayAllArtistSongsButton from "../../components/buttons/playAllArtistSongButton/PlayAllArtistSongButton";
import useFetch from "../../hooks/useFetch";
import PlayPauseVibe from "../../components/buttons/playPauseVibe/PlayPauseVibe";
import SongItem from "../../components/songItem/SongItem";
import Card from "../../components/card/Card";
import axios from "axios";
import lazyCat from "../../images/lazyCat.png";

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get("q");
    const [selectedChip, setSelectedChip] = useState("0");
    const { data: initialData, loading: initialDataLoading } = useFetch("/search?q=" + q + "&type=artist,album,song,playlist,profile&limit=5");
    const [curData, setCurData] = useState([]);
    const [curDataLoading, setCurDataLoading] = useState(false);
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    const appWrapper = document.querySelector(".app-wrapper");

    const [additionalSongs, setAdditionalSongs] = useState([]);
    const [additionalSongsLoading, setAdditionalSongsLoading] = useState(false);

    useEffect(() => {
        let limit = 0;
        setAdditionalSongs([]);
        if (initialData?.songs?.length < 5) {
            const loadAdditionalSongs = async () => {
                setAdditionalSongsLoading(true);
                const fetchData = async (url) => {
                    const res = await axios.get(process.env.REACT_APP_API_URL + url);
                    if (res.data.length > 0) {
                        const data = res.data;
                        setAdditionalSongsLoading(false);
                        return data;
                    }
                };

                limit = 5 - initialData?.songs?.length;
                if (initialData?.artists?.length > 0) {
                    const id = initialData?.artists[0]?._id;
                    const temp = await fetchData("/artists/" + id + "/top-songs?limit=" + limit);
                    setAdditionalSongs(temp);
                } else if (initialData?.albums?.length > 0) {
                    const id = initialData?.albums[0]?._id;
                    let temp = await fetchData("/albums/" + id + "/songs?limit=" + limit);
                    // Find and remove duplicate song  
                    if (initialData?.songs?.length > 0) {
                        const lengthInitial = initialData?.songs?.length;
                        const lengthTemp = temp?.length;
                        if (lengthInitial === lengthTemp) {
                            if (initialData?.songs[0]?._id === temp[0]?._id) {
                                temp = [];
                            }
                        } else if (lengthInitial > lengthTemp) {
                            await initialData?.songs?.forEach((song, index) => {
                                temp.forEach(initialSong => {
                                    if (initialSong?._id === song?._id) {
                                        temp.splice(index, 1);
                                    }
                                })
                            });
                        } else {
                            await temp.forEach((song, index) => {
                                initialData?.songs?.forEach(initialSong => {
                                    if (initialSong?._id === song?._id) {
                                        temp.splice(index, 1);
                                    }
                                })
                            });
                        }
                    }
                    setAdditionalSongs(temp);
                } else if (initialData?.playlists?.length > 0) {
                    const id = initialData?.playlists[0]?._id;
                    const temp = await fetchData("/playlists/" + id + "/songs?limit=" + limit);
                    setAdditionalSongs(temp);
                }
                setAdditionalSongsLoading(false);
            }
            loadAdditionalSongs();
        } else {
            setAdditionalSongsLoading(false);
        }
    }, [initialData]);

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const handleOnClickChip = async (value) => {
        appWrapper.scrollTo(0, 0);

        if (selectedChip !== value) {
            setOffset(0);
            setCurData([]);
            setHasMore(true);
            setSelectedChip(value);

            if (value === "1") {
                setCurDataLoading(true);
                const res = await axios.get(process.env.REACT_APP_API_URL + "/search?q=" + q + "&type=artist&limit=20");
                setCurData(oldData => [...oldData, ...res.data.artists]);
                setCurDataLoading(false);
            } else if (value === "2") {
                setCurDataLoading(true);
                const res = await axios.get(process.env.REACT_APP_API_URL + "/search?q=" + q + "&type=album&limit=20");
                setCurData(oldData => [...oldData, ...res.data.albums]);
                setCurDataLoading(false);
            } else if (value === "3") {
                setCurDataLoading(true);
                const res = await axios.get(process.env.REACT_APP_API_URL + "/search?q=" + q + "&type=song&limit=20");
                setCurData(oldData => [...oldData, ...res.data.songs]);
                setCurDataLoading(false);
            } else if (value === "4") {
                setCurDataLoading(true);
                const res = await axios.get(process.env.REACT_APP_API_URL + "/search?q=" + q + "&type=playlist&limit=20");
                setCurData(oldData => [...oldData, ...res.data.playlists]);
                setCurDataLoading(false);
            } else if (value === "5") {
                setCurDataLoading(true);
                const res = await axios.get(process.env.REACT_APP_API_URL + "/search?q=" + q + "&type=profile&limit=20");
                setCurData(oldData => [...oldData, ...res.data.profiles]);
                setCurDataLoading(false);
            }
        }
    };

    const loadMore = async (value) => {
        if (value === "1") {
            const res = await axios.get(process.env.REACT_APP_API_URL + "/search?q=" + q + "&type=artist&limit=20&offset=" + offset);
            if (res.data.length === 0) {
                setHasMore(false);
                return;
            }
            setCurData(oldData => [...oldData, ...res.data.artists]);
        } else if (value === "2") {
            const res = await axios.get(process.env.REACT_APP_API_URL + "/search?q=" + q + "&type=album&limit=20&offset=" + offset);
            if (res.data.length === 0) {
                setHasMore(false);
                return;
            }
            setCurData(oldData => [...oldData, ...res.data.albums]);
        } else if (value === "3") {
            const res = await axios.get(process.env.REACT_APP_API_URL + "/search?q=" + q + "&type=song&limit=20&offset=" + offset);
            if (res.data.length === 0) {
                setHasMore(false);
                return;
            }
            setCurData(oldData => [...oldData, ...res.data.songs]);
        } else if (value === "4") {
            const res = await axios.get(process.env.REACT_APP_API_URL + "/search?q=" + q + "&type=playlist&limit=20&offset=" + offset);
            if (res.data.length === 0) {
                setHasMore(false);
                return;
            }
            setCurData(oldData => [...oldData, ...res.data.playlists]);
        } else if (value === "5") {
            const res = await axios.get(process.env.REACT_APP_API_URL + "/search?q=" + q + "&type=profile&limit=20&offset=" + offset);
            if (res.data.length === 0) {
                setHasMore(false);
                return;
            }
            setCurData(oldData => [...oldData, ...res.data.profiles]);
        }
    };

    const [imgSrc, setImgSrc] = useState("");
    const [link, setLink] = useState("");
    const [item, setItem] = useState(null);
    const [typeItem, setTypeItem] = useState("");

    useEffect(() => {
        if (initialData?.artists?.length > 0) {
            const img = initialData.artists[0].images.filter(img => {
                return img.type === "avatar";
            });
            setImgSrc(img[0].src);

            const id = initialData.artists[0]._id;
            setLink("/artists/" + id);

            setItem(initialData.artists[0]);
            setTypeItem("artist");
        } else if (initialData?.albums?.length > 0) {
            setImgSrc(initialData?.albums[0]?.images[0]);

            const id = initialData.albums[0]._id;
            setLink("/albums/" + id);

            setItem(initialData.albums[0]);
            setTypeItem("album");
        } else if (initialData?.playlists?.length > 0) {
            setImgSrc(initialData?.playlists[0]?.images[0]);

            const id = initialData.playlists[0]._id;
            setLink("/playlists/" + id);

            setItem(initialData.playlists[0]);
            setTypeItem("playlist");
        } else if (initialData?.songs?.length > 0) {
            setImgSrc(initialData?.songs[0]?.album?.images[0]);

            const id = initialData?.songs[0]?.album._id;
            setLink("/albums/" + id);

            setItem(initialData?.songs[0]);
            setTypeItem("song");
        }
    }, [initialData]);

    useEffect(() => {
        if (selectedChip === "0") {
            const topResultBox = document.querySelector(".top-result-box");
            if (topResultBox) {
                topResultBox.style.setProperty("--background-src", `url(${imgSrc})`);
            }
        }
    }, [q, selectedChip, initialData, imgSrc]);

    useEffect(() => {
        if (appWrapper) {
            appWrapper.addEventListener("scroll", () => {
                const scrollTop = appWrapper.scrollTop;
                const scrollHeight = appWrapper.scrollHeight;
                const innerHeight = window.innerHeight;
                if ((innerHeight + scrollTop + 3) >= scrollHeight) {
                    if (selectedChip === "0" || !hasMore) {
                        return;
                    }
                    const temp = offset + 20;
                    setOffset(temp);
                }
            });
        }
    }, [selectedChip, offset, hasMore, appWrapper]);

    useEffect(() => {
        if (offset >= 20) {
            loadMore(selectedChip);
        }
    }, [offset, selectedChip]);

    return (
        <div className="search">
            <div className="wrapper-search">
                {!q
                    ? <>
                        You can search any songs, artists...
                    </>
                    : initialDataLoading
                        ? <div className="loading-wrapper">
                            <CircularProgress className="circular" />
                        </div>
                        : (initialData?.albums?.length === 0
                            && initialData?.artists?.length === 0
                            && initialData?.songs?.length === 0
                            && initialData?.playlists?.length === 0
                            && initialData?.profiles?.length === 0)
                            ? <div className="not-found">
                                <p>Không tìm thấy kết quả của "{q}"...</p>
                                <img src={lazyCat} alt="Hình ảnh lazy cat" />
                            </div>
                            : <>
                                <div className="chips">
                                    <Chip
                                        label="Tất cả"
                                        clickable
                                        className={`chip ${selectedChip === "0" && "selected"}`}
                                        onClick={() => handleOnClickChip("0")}
                                    />
                                    {initialData?.artists?.length > 0 &&
                                        <Chip
                                            label="Nghệ sĩ"
                                            clickable
                                            className={`chip ${selectedChip === "1" && "selected"}`}
                                            onClick={() => handleOnClickChip("1")}
                                        />
                                    }
                                    {initialData?.albums?.length > 0 &&
                                        <Chip
                                            label="Album"
                                            clickable
                                            className={`chip ${selectedChip === "2" && "selected"}`}
                                            onClick={() => handleOnClickChip("2")}
                                        />
                                    }
                                    {(initialData?.songs?.length > 0 || additionalSongs?.length > 0) &&
                                        <Chip
                                            label="Bài hát"
                                            clickable
                                            className={`chip ${selectedChip === "3" && "selected"}`}
                                            onClick={() => handleOnClickChip("3")}
                                        />
                                    }
                                    {initialData?.playlists?.length > 0 &&
                                        <Chip
                                            label="Playlist"
                                            clickable
                                            className={`chip ${selectedChip === "4" && "selected"}`}
                                            onClick={() => handleOnClickChip("4")}
                                        />
                                    }
                                    {initialData?.profiles?.length > 0 &&
                                        <Chip
                                            label="Profile"
                                            clickable
                                            className={`chip ${selectedChip === "5" && "selected"}`}
                                            onClick={() => handleOnClickChip("5")}
                                        />
                                    }
                                </div>
                                <div className="results">
                                    {selectedChip === "0" &&
                                        <>
                                            {(initialData?.artists?.length > 0 || initialData?.albums?.length > 0 || initialData?.playlists?.length > 0) &&
                                                <section className="first">
                                                    <div className="results-first-left">
                                                        <h3 className="title">Kết quả hàng đầu</h3>
                                                        <Link to={link}>
                                                            <div className={`top-result-box ${initialData?.artists?.length > 0 && "artist"}`}>
                                                                <div className="wrapper-img">
                                                                    <img
                                                                        src={imgSrc}
                                                                        alt="Hình ảnh"
                                                                    />
                                                                </div>
                                                                <div className="content">
                                                                    <p className="name">
                                                                        {initialData?.artists?.length > 0
                                                                            ? initialData.artists[0].name
                                                                            : initialData?.albums?.length > 0
                                                                                ? initialData.albums[0].name
                                                                                : initialData?.playlists?.length > 0
                                                                                    ? initialData.playlists[0].name
                                                                                    : initialData?.songs?.length > 0
                                                                                    && initialData.songs[0].name
                                                                        }
                                                                    </p>
                                                                    {initialData?.artists?.length === 0 &&
                                                                        <>
                                                                            {initialData?.albums?.length > 0
                                                                                ?
                                                                                <div className="artists">
                                                                                    {initialData?.albums[0]?.artists?.map((artist, index) => (
                                                                                        <React.Fragment key={artist._id}>
                                                                                            <span>
                                                                                                {isTouchDevice
                                                                                                    ? artist.name
                                                                                                    :
                                                                                                    <Link to={`/artists/${artist._id}`}>
                                                                                                        {artist.name}
                                                                                                    </Link>
                                                                                                }
                                                                                            </span>
                                                                                            {index < initialData.albums[0].artists.length - 1 &&
                                                                                                <span className="comma">, </span>
                                                                                            }
                                                                                        </React.Fragment>
                                                                                    ))}
                                                                                </div>
                                                                                : initialData?.playlists?.length > 0
                                                                                    ? <div className="desc">
                                                                                        {initialData.playlists[0].desc}
                                                                                    </div>
                                                                                    : <div className="artists">
                                                                                        <div className="artists">
                                                                                            {initialData?.songs[0]?.artists?.map((artist, index) => (
                                                                                                <React.Fragment key={artist._id}>
                                                                                                    <span>
                                                                                                        {isTouchDevice
                                                                                                            ? artist.name
                                                                                                            :
                                                                                                            <Link to={`/artists/${artist._id}`}>
                                                                                                                {artist.name}
                                                                                                            </Link>
                                                                                                        }
                                                                                                    </span>
                                                                                                    {index < initialData.songs[0].artists.length - 1 &&
                                                                                                        <span className="comma">, </span>
                                                                                                    }
                                                                                                </React.Fragment>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                            }
                                                                        </>}
                                                                </div>
                                                                <div className="button" onClick={(e) => e.preventDefault()}>
                                                                    {initialData?.artists?.length > 0
                                                                        ? <PlayAllArtistSongsButton id={initialData?.artists[0]?._id} />
                                                                        : <PlayPauseVibe item={item} type={typeItem} />
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                    <div className="results-first-right">
                                                        <h3 className="title">Các bài hát</h3>
                                                        <div className={`songs ${initialDataLoading || additionalSongsLoading}`}>
                                                            {additionalSongsLoading
                                                                ? <>
                                                                    {[...Array(5)].map((_, index) => (
                                                                        <Skeleton key={index} variant="rounded" className="song-item skeleton" />
                                                                    ))}
                                                                </>
                                                                : initialData?.songs?.length >= 5
                                                                    ? <>
                                                                        {initialData.songs.map((song) => (
                                                                            <SongItem key={song._id} song={song} />
                                                                        ))}
                                                                    </>
                                                                    : additionalSongs?.length > 0
                                                                        ? <>
                                                                            {initialData?.songs?.map((song) => (
                                                                                <SongItem key={song._id} song={song} />
                                                                            ))}
                                                                            {additionalSongs?.length > 0 && additionalSongs?.map((song => (
                                                                                <SongItem key={song._id} song={song} />
                                                                            )))}
                                                                        </>
                                                                        : <>
                                                                            {initialData?.songs?.map((song) => (
                                                                                <SongItem key={song._id} song={song} />
                                                                            ))}
                                                                        </>}
                                                        </div>
                                                    </div>
                                                </section>
                                            }
                                            {initialData?.albums?.length > 0 &&
                                                <section className="albums">
                                                    <h3 className="title">Albums</h3>

                                                    <div className="cards">
                                                        {initialData?.albums?.map((item) => (
                                                            <Card key={item._id} type="album" item={item} />
                                                        ))}
                                                    </div>
                                                </section>
                                            }
                                            {initialData?.playlists?.length > 0 &&
                                                <section className="playlists">
                                                    <h3 className="title">Playlists</h3>

                                                    <div className="cards">
                                                        {initialData?.playlists?.map((item) => (
                                                            <Card key={item._id} type="playlist" item={item} />
                                                        ))}
                                                    </div>
                                                </section>
                                            }
                                            {initialData?.artists?.length > 0 &&
                                                <section className="artists">
                                                    <h3 className="title">Nghệ sĩ</h3>

                                                    <div className="cards">
                                                        {initialData?.artists?.map((item) => (
                                                            <Card key={item._id} type="artist" item={item} />
                                                        ))}
                                                    </div>
                                                </section>
                                            }
                                            {initialData?.profiles?.length > 0 &&
                                                <section className="profiles">
                                                    <h3 className="title">Profiles</h3>

                                                    <div className="cards">
                                                        {initialData?.profiles?.map((item) => (
                                                            <Card key={item._id} type="profile" item={item} />
                                                        ))}
                                                    </div>
                                                </section>
                                            }
                                        </>
                                    }
                                    {selectedChip === "1" && <>
                                        <div className="cards-specific-type">
                                            {curDataLoading
                                                ? <>
                                                    {[...Array(1)].map((_, index) => (
                                                        <div className="wrapper-item" key={index}>
                                                            <div className="item">
                                                                <Skeleton variant="rounded" className="card skeleton" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                                : <>
                                                    {curData?.map((item) => (
                                                        <Card key={item._id} type="artist" item={item} />
                                                    ))}
                                                </>}
                                        </div>
                                    </>}
                                    {selectedChip === "2" && <>
                                        <div className="cards-specific-type">
                                            {curDataLoading
                                                ? <>
                                                    {[...Array(1)].map((_, index) => (
                                                        <div className="wrapper-item" key={index}>
                                                            <div className="item">
                                                                <Skeleton variant="rounded" className="card skeleton" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                                : <>
                                                    {curData?.map((item) => (
                                                        <Card key={item._id} type="album" item={item} />
                                                    ))}
                                                </>}
                                        </div>
                                    </>}
                                    {selectedChip === "3" && <>
                                        <div className="cards-specific-type">
                                            {curDataLoading || additionalSongsLoading
                                                ? <>
                                                    {[...Array(1)].map((_, index) => (
                                                        <div className="wrapper-item" key={index}>
                                                            <div className="item">
                                                                <Skeleton variant="rounded" className="card skeleton" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                                : <>
                                                    {curData?.map((item) => (
                                                        <Card key={item._id} type="song" item={item} />
                                                    ))}
                                                    {additionalSongs?.map((item) => (
                                                        <Card key={item._id} type="song" item={item} />
                                                    ))}
                                                </>}
                                        </div>
                                    </>}
                                    {selectedChip === "4" && <>
                                        <div className="cards-specific-type">
                                            {curDataLoading
                                                ? <>
                                                    {[...Array(1)].map((_, index) => (
                                                        <div className="wrapper-item" key={index}>
                                                            <div className="item">
                                                                <Skeleton variant="rounded" className="card skeleton" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                                : <>
                                                    {curData?.map((item) => (
                                                        <Card key={item._id} type="playlist" item={item} />
                                                    ))}
                                                </>}
                                        </div>
                                    </>}
                                    {selectedChip === "5" && <>
                                        <div className="cards-specific-type">
                                            {curDataLoading
                                                ? <>
                                                    {[...Array(1)].map((_, index) => (
                                                        <div className="wrapper-item" key={index}>
                                                            <div className="item">
                                                                <Skeleton variant="rounded" className="card skeleton" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                                : <>
                                                    {curData?.map((item) => (
                                                        <Card key={item._id} type="profile" item={item} />
                                                    ))}
                                                </>}
                                        </div>
                                    </>}
                                </div>
                            </>}
            </div>
        </div >
    )
}
