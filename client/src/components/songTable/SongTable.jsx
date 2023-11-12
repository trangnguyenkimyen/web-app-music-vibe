import { useState } from "react";
import SongRow from "../songRow/SongRow";
import "./songTable.scss";
import { Collapse, Skeleton } from "@mui/material";

export default function SongTable({ type, songs, createdAt, loading }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className={`song-table ${type}`}>
            <div className="title">
                <div className="number">#</div>
                <div className={`song-info ${type === "playlist" ? "playlist" : "album"}`}>Tên bài hát</div>
                {type === "playlist"
                    ? <>
                        <div className="song-album">Album</div>
                        <div className="song-createdAt">Ngày thêm</div>
                    </>
                    : <>
                        <div className="song-plays">Lượt phát</div>
                    </>
                }
                <div className="button liked"></div>
                <div className="song-duration">Thời lượng</div>
                <div className="button more"></div>
            </div>
            <div className="body">
                {loading
                    ? <Skeleton variant="rounded" className="song-row skeleton" height={44} />
                    : <>
                        {type === "artist"
                            ? <>
                                {songs?.slice(0, 5).map((song, i) => (
                                    <SongRow key={i} type={type} number={i + 1} song={song} createdAt={createdAt} />
                                ))}
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    {songs?.slice(5, 10).map((song, i) => (
                                        <SongRow key={i} type={type} number={i + 6} song={song} createdAt={createdAt} />
                                    ))}
                                </Collapse>
                            </>
                            : <>
                                {songs?.map((song, i) => (
                                    <SongRow key={i} type={type} number={i + 1} song={song} createdAt={createdAt} />
                                ))}
                            </>
                        }
                    </>}
            </div>
            {type === "artist" &&
                songs?.length > 5 &&
                <div className="collapse-button">
                    <span
                        expand={expanded.toString()}
                        onClick={() => setExpanded(!expanded)}
                        className="text"
                    >
                        {expanded ? "Ẩn bớt" : "Xem thêm"}
                    </span>
                </div>
            }
        </div>
    )
}
