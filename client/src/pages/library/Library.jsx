import { useContext, useEffect, useState } from "react";
import "./library.scss";
import SongTable from "../../components/songTable/SongTable";
import Card from "../../components/card/Card";
import { Chip, Skeleton } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Library() {
    const [selectedChip, setSelectedChip] = useState("0");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [curData, setCurData] = useState([]);
    const [curDataLoading, setCurDataLoading] = useState(false);
    const appWrapper = document.querySelector(".app-wrapper");
    const { user } = useContext(AuthContext);

    useEffect(() => {
        document.title = "vibe - Thư viện";
    }, []);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                const res = await axios.get("/me/liked-songs");
                setData(res.data);
                setLoading(false);
            };
            fetchData();
        }
    }, [user]);

    const handleOnClickChip = async (value) => {
        appWrapper.scrollTo(0, 0);

        if (selectedChip !== value) {
            setCurData([]);
            setSelectedChip(value);

            if (value === "1") {
                setCurDataLoading(true);
                const res = await axios.get("/me/liked-albums");
                setCurData(oldData => [...oldData, ...res.data]);
                setCurDataLoading(false);
            } else if (value === "2") {
                setCurDataLoading(true);
                const res = await axios.get("/me/liked-playlists");
                setCurData(oldData => [...oldData, ...res.data]);
                setCurDataLoading(false);
            } else if (value === "3") {
                setCurDataLoading(true);
                const res = await axios.get("/me/following?type=artist");
                setCurData(oldData => [...oldData, ...res.data]);
                setCurDataLoading(false);
            }
        }
    };

    return (
        <div className="library">
            <div className="library-wrapper">
                <div className="chips">
                    <Chip
                        label="Bài hát"
                        clickable
                        className={`chip ${selectedChip === "0" && "selected"}`}
                        onClick={() => handleOnClickChip("0")}
                    />
                    <Chip
                        label="Album"
                        clickable
                        className={`chip ${selectedChip === "1" && "selected"}`}
                        onClick={() => handleOnClickChip("1")}
                    />
                    <Chip
                        label="Playlist"
                        clickable
                        className={`chip ${selectedChip === "2" && "selected"}`}
                        onClick={() => handleOnClickChip("2")}
                    />
                    <Chip
                        label="Nghệ sĩ"
                        clickable
                        className={`chip ${selectedChip === "3" && "selected"}`}
                        onClick={() => handleOnClickChip("3")}
                    />
                </div>
                <div className="contents">
                    {selectedChip === "0"
                        ? <>
                            {loading
                                ? "Đang load, đợi tí nha..."
                                : data?.length > 0
                                    ? <SongTable type="library" songs={data} loading={loading} />
                                    : "Có vẻ chưa có bài hát nào hợp vibe bạn"}
                        </>
                        : selectedChip === "1"
                            ? <>
                                <div className="cards">
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
                                            {curData?.length > 0
                                                ? curData?.map((item) => (
                                                    <Card key={item._id} type="album" item={item} />
                                                ))
                                                : "Có vẻ chưa có album nào hợp vibe bạn"}
                                        </>}
                                </div>
                            </>
                            : selectedChip === "2"
                                ? <>
                                    <div className="cards">
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
                                                {curData?.length > 0
                                                    ? curData?.map((item) => (
                                                        <Card key={item._id} type="playlist" item={item} />
                                                    ))
                                                    : "Có vẻ chưa có playlist nào hợp vibe bạn"}
                                            </>}
                                    </div>
                                </>
                                : <>
                                    <div className="cards">
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
                                                {curData?.length > 0
                                                    ? curData?.map((item) => (
                                                        <Card key={item._id} type="artist" item={item} />
                                                    ))
                                                    : "Có vẻ chưa có nghệ sĩ nào hợp vibe bạn"}
                                            </>}
                                    </div>
                                </>}
                </div>
            </div>
        </div>
    )
}
