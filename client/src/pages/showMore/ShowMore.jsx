import Card from "../../components/card/Card";
import "./showMore.scss";
import { Link, useLocation } from "react-router-dom";

export default function ShowMore() {
    const location = useLocation();
    const currentPath = decodeURIComponent(location.pathname);
    const sectionName = currentPath.split("/")[2];

    return (
        <div className="show-more">
            <div className="show-more-wrapper">
                <h3 className="section-name">
                    {sectionName}
                </h3>
                <div className="cards">
                    {[...Array(12)].map((_, index) => (
                        <div className="wrapper-item">
                            <div className="item">
                                <Link to={`/playlists/${index}`}>
                                    <Card key={index} type="playlist" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
