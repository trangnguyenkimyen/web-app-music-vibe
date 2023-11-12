import { Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import "./section.scss";
import Card from "../card/Card";
import useFetch from "../../hooks/useFetch";

export default function Section({ type, title, url }) {
    const width = window.innerWidth;
    let limit = 6;
    if (width < 576) {
        limit = 5;
    }
    else if (width >= 576 && width <= 992) {
        limit = 3;
    }
    else if (width >= 993 && width <= 1200) {
        limit = 4;
    }
    else if (width >= 1201 && width <= 1400) {
        limit = 5;
    }
    const { data, loading } = useFetch(url + limit);

    return (
        <>
            {data?.length > 0 &&
                <section>
                    <div className="title">
                        <h3 className="title-text">
                            {data?.length === limit
                                ? <Link
                                    to={`/section/${title}`}
                                    state={{ url, type }}
                                >
                                    {title}
                                </Link>
                                : title
                            }
                        </h3>
                        {data?.length === limit &&
                            <Link
                                to={`/section/${title}`}
                                state={{ url, type }}
                            >
                                <p className="expanded">Xem thêm</p>
                            </Link>}
                    </div>
                    <div className="cards">
                        {loading
                            ? <>
                                {[...Array(limit)].map((_, index) => (
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
                </section>
            }</>
    )
}
