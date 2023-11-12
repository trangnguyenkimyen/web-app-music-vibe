import { Skeleton } from "@mui/material";
import Card from "../../components/card/Card";
import useFetch from "../../hooks/useFetch";
import "./showMore.scss";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function ShowMore() {
    const location = useLocation();
    const currentPath = decodeURIComponent(location.pathname);
    const sectionName = currentPath.split("/")[2];
    const url = location.state.url;
    const type = location.state.type;
    const limit = 20;
    const { data, loading } = useFetch(url + limit);

    useEffect(() => {
        document.title = sectionName;
    }, [sectionName]);

    return (
        <div className="show-more">
            <div className="show-more-wrapper">
                <h3 className="section-name">
                    {sectionName}
                </h3>
                <div className="cards">
                    {loading
                        ? <>
                            {[...Array(5)].map((_, index) => (
                                <div className="wrapper-item" key={index}>
                                    <div className="item">
                                        <Skeleton variant="rounded" className="card skeleton" />
                                    </div>
                                </div>
                            ))}
                        </>
                        : <>
                            {data.map((item, index) => (
                                <Card key={index} type={type || item.type} item={item} />
                            ))}
                        </>
                    }
                </div>
            </div>
        </div>
    )
}
