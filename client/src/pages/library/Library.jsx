import { useEffect, useState } from "react";
import "./library.scss";
import SongTable from "../../components/songTable/SongTable";
import { Link } from "react-router-dom";
import Card from "../../components/card/Card";
import { Chip } from "@mui/material";

export default function Library() {
    const [selectedChip, setSelectedChip] = useState("0");

    useEffect(() => {
        document.title = "vibe - Thư viện";
    }, []);

    return (
        <div className="library">
            <div className="library-wrapper">
                <div className="chips">
                    <Chip
                        label="Bài hát"
                        clickable
                        className={`chip ${selectedChip === "0" && "selected"}`}
                        onClick={() => setSelectedChip("0")}
                    />
                    <Chip
                        label="Album"
                        clickable
                        className={`chip ${selectedChip === "1" && "selected"}`}
                        onClick={() => setSelectedChip("1")}
                    />
                    <Chip
                        label="Playlist"
                        clickable
                        className={`chip ${selectedChip === "2" && "selected"}`}
                        onClick={() => setSelectedChip("2")}
                    />
                    <Chip
                        label="Nghệ sĩ"
                        clickable
                        className={`chip ${selectedChip === "3" && "selected"}`}
                        onClick={() => setSelectedChip("3")}
                    />
                </div>
                <div className="contents">
                    {selectedChip === "0"
                        ? <>
                            <SongTable type="playlist" />
                        </>
                        : selectedChip === "1"
                            ? <>
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
                            </>
                            : selectedChip === "2"
                                ? <>
                                    <div className="cards">
                                        {[...Array(10)].map((_, index) => (
                                            <div className="wrapper-item">
                                                <div className="item">
                                                    <Link to={`/playlists/${index}`}>
                                                        <Card key={index} type="playlist" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                                : <>
                                    <div className="cards">
                                        {[...Array(6)].map((_, index) => (
                                            <div className="wrapper-item">
                                                <div className="item">
                                                    <Link to={`/artists/${index}`}>
                                                        <Card key={index} type="artist" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>}
                </div>
            </div>
        </div>
    )
}
