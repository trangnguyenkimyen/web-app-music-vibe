import { useState } from "react";
import SongRow from "../songRow/SongRow";
import "./songTable.scss";
import { Collapse } from "@mui/material";

export default function SongTable({ type }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="song-table">
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
                {Array.from({ length: 5 }).map((_, i) => (
                    <SongRow key={i} type={type} number={i + 1} />
                ))}
                {type === "artist" &&
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <SongRow key={i} type={type} number={i + 6} />
                        ))}
                    </Collapse>
                }
            </div>
            {type === "artist" &&
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
