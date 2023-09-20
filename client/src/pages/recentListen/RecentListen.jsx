import { useEffect } from "react";
import "./recentListen.scss";
import { Link } from "react-router-dom";
import Card from "../../components/card/Card";

export default function RecentListen() {

    useEffect(() => {
        document.title = "vibe - Nghe gần đây";
    }, []);

    return (
        <div className="recent-listen">
            <div className="recent-listen-wrapper">
                <h4 className="title">Nhật kí nghe của bạn</h4>

                <section>
                    <h4 className="section-title">Hôm nay</h4>
                    <div className="cards">
                        {[...Array(7)].map((_, index) => (
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
                    <h4 className="section-title">Chủ nhật</h4>
                    <div className="cards">
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
            </div>
        </div>
    )
}
