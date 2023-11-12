import { useEffect } from "react";
import "./recentListen.scss";
import { Link } from "react-router-dom";
import Card from "../../components/card/Card";
import useFetch from "../../hooks/useFetch";
import { Skeleton } from "@mui/material";

export default function RecentListen() {
    const { data, loading } = useFetch("/me/currently-played");

    useEffect(() => {
        document.title = "vibe - Nghe gần đây";
    }, []);

    return (
        <div className="recent-listen">
            <div className="recent-listen-wrapper">
                <h4 className="title">Nhật kí nghe của bạn</h4>

                <div className="cards">
                    {loading
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
                            {data.length > 0
                                ? data.map((item, index) => (
                                    <Card key={index} type={item.type} item={item} />
                                ))
                                : "Bạn chưa nghe bài nào hết"
                            }
                        </>
                    }
                </div>
            </div>
        </div>
    )
}
