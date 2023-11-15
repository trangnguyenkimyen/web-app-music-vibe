import "./artist.scss";
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { ColorExtractor } from "react-color-extractor";
import PlayAllArtistSongsButton from "../../components/buttons/playAllArtistSongButton/PlayAllArtistSongButton";
import FollowButton from "../../components/buttons/followButton/FollowButton";
import SongTable from "../../components/songTable/SongTable";
import { Box, Chip, Grow, Modal, Skeleton, Tab } from "@mui/material";
import { TabPanel, TabContext, TabList } from "@mui/lab";
import Card from "../../components/card/Card";
import { useLocation, useParams } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import useFetch from "../../hooks/useFetch";
import Section from "../../components/section/Section";

export default function Artist() {
    const [colors, setColors] = useState([]);
    const [valueTab, setValueTab] = useState("0");
    const [selectedChipSecondPanel, setSelectedChipSecondPanel] = useState("0");
    const [selectedChipThirdPanel, setSelectedChipThirdPanel] = useState("0");
    const [selectedChipFourthPanel, setSelectedChipFourthPanel] = useState("0");
    const [openModal, setOpenModal] = useState(false);
    const [imgSrc, setImgSrc] = useState("");

    const location = useLocation();
    const title = location.state?.title;
    const params = useParams();
    const artistId = params.id;
    const { data: artistData, loading: artistLoading } = useFetch("/artists/find/" + artistId);
    const { data: topSongsData, loading: topSongsLoading } = useFetch("/artists/" + artistId + "/top-songs?limit=10");
    const { data: singleAndEpData } = useFetch("/artists/" + artistId + "/albums?include_groups=single,ep");
    const { data: albumData } = useFetch("/artists/" + artistId + "/albums?include_groups=album");
    const { data: appearsOnData } = useFetch("/artists/" + artistId + "/albums?include_groups=appears_on");
    const [avatar, setAvatar] = useState("");
    const [bg, setBg] = useState("");
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    useEffect(() => {
        if (artistData) {
            setAvatar("");
            setBg("");
            artistData?.images?.forEach((image) => {
                if (image.type === "avatar") {
                    setAvatar(image.src);
                } else if (image.type === "") {
                    setBg(image.src);
                }
            });
        }
    }, [artistData]);

    useEffect(() => {
        const artistHeader = document.querySelector(".artist-background");
        if (colors.length > 0) {
            artistHeader.style.setProperty("--color", colors[4]);
        }
    }, [colors]);

    useEffect(() => {
        setValueTab("0");
        document.title = (title ? title : artistData?.name ? artistData.name : "Name") + " - Artist";
    }, [title, artistData]);

    // const handleTabChange = (e, value) => {
    //     setValueTab(value);
    //     const element = document.querySelector(".tab-panels");
    //     if (element) {
    //         element.scrollIntoView({ behavior: "smooth", block: "start" });
    //     }
    // }

    const handleClick = (img) => {
        setOpenModal(true);
        setImgSrc(img);
    };

    const sortNewestReleased = (array) => {
        const tempArr = [...array];
        tempArr.sort((a, b) => {
            return new Date(b.release_date) - new Date(a.release_date);
        });
        return tempArr;
    };

    const sortOldestReleased = (array) => {
        const tempArr = [...array];
        tempArr.sort((a, b) => {
            return new Date(a.release_date) - new Date(b.release_date);
        });
        return tempArr;
    };

    return (
        <div className="artist">
            <div className="artist-wrapper">
                <div className="artist-top">
                    <div className={`artist-background ${!bg ? "noBg" : "bg"} ${artistLoading && "loading"}`}>
                        {artistLoading
                            ? <Skeleton variant="rounded" className="skeleton" />
                            : <>
                                <ColorExtractor getColors={(colors) => { setColors(colors) }} >
                                    <img src={bg ? bg : avatar} alt={`Hình nền của ${artistData?.name}`} />
                                </ColorExtractor>
                                <div className="no-background"></div>
                            </>}
                    </div>
                    <div className="artist-header">
                        <div className="left">
                            <div className="first">
                                <div className="artist-avatar">
                                    {artistLoading
                                        ? <Skeleton variant="circular" className="skeleton" />
                                        :
                                        <img src={avatar} alt={`Avatar của ${artistData?.name}`} />
                                    }
                                </div>
                            </div>
                            <div className="second">
                                <div className="artist-name">
                                    <h3 className="text">
                                        {artistLoading
                                            ? <Skeleton variant="text" className="skeleton" width={100} />
                                            : artistData?.name}
                                    </h3>
                                </div>
                                <div className="artist-listeners">
                                    <span className="text">
                                        {artistLoading
                                            ? <Skeleton variant="text" className="skeleton" width={200} />
                                            : "3,000,000 lượt nghe mỗi tháng"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <PlayAllArtistSongsButton id={artistData?._id} />
                            <FollowButton id={artistData?._id} type="artist" />
                        </div>
                    </div>
                </div>
                <div className="artist-bottom" >
                    <section className="popular-songs">
                        <div className="title-section">
                            <h3 className="title-text">Các bài hát phổ biến</h3>
                        </div>
                        <div className="songs" >
                            <SongTable type="artist" songs={topSongsData} loading={topSongsLoading} />
                        </div>
                    </section>
                    <section className="tabs" >
                        <TabContext value={valueTab}>
                            <Box sx={{ borderBottom: 1, borderColor: "#96969650" }} className="tablist-box">
                                <TabList
                                    variant="scrollable"
                                    allowScrollButtonsMobile
                                    textColor="inherit"
                                    onChange={(_, value) => setValueTab(value)}
                                    className="tablist"
                                >
                                    <Tab value="0" label="Bản phát hành" className="tab" />
                                    {singleAndEpData?.length > 0 &&
                                        <Tab value="1" label="Single & EP" className="tab" />
                                    }
                                    {albumData?.length > 0 &&
                                        <Tab value="2" label="Album" className="tab" />
                                    }
                                    {appearsOnData?.length > 0 &&
                                        <Tab value="3" label="Xuất hiện trong" className="tab" />
                                    }
                                    <Tab value="4" label="Về nghệ sĩ" className="tab" />
                                </TabList>
                            </Box>
                            <div className="tab-panels">
                                <TabPanel value="0" className="tab-panel first" >
                                    <Section
                                        title="Phổ biến"
                                        url={"/artists/" + artistId + "/albums?limit="}
                                        type="album"
                                    />
                                    <Section
                                        title="Single & EP"
                                        url={"/artists/" + artistId + "/albums?include_groups=single,ep&limit="}
                                        type="album"
                                    />
                                    <Section
                                        title="Album"
                                        url={"/artists/" + artistId + "/albums?include_groups=album&limit="}
                                        type="album"
                                    />
                                    <Section
                                        title="Xuất hiện trong"
                                        url={"/artists/" + artistId + "/albums?include_groups=appears_on&limit="}
                                        type="album"
                                    />
                                </TabPanel>
                                <TabPanel value="1" className="tab-panel second">
                                    <div className="chips">
                                        <Chip
                                            label="Mới nhất"
                                            clickable
                                            className={`chip ${selectedChipSecondPanel === "0" && "selected"}`}
                                            onClick={() => setSelectedChipSecondPanel("0")}
                                        />
                                        <Chip
                                            label="Phổ biến"
                                            clickable
                                            className={`chip ${selectedChipSecondPanel === "1" && "selected"}`}
                                            onClick={() => setSelectedChipSecondPanel("1")}
                                        />
                                        <Chip
                                            label="Cũ nhất"
                                            clickable
                                            className={`chip ${selectedChipSecondPanel === "2" && "selected"}`}
                                            onClick={() => setSelectedChipSecondPanel("2")}
                                        />
                                    </div>
                                    <div className="contents">
                                        <div className="cards custom">
                                            {selectedChipSecondPanel === "0"
                                                ? <>
                                                    {sortNewestReleased(singleAndEpData)?.map((item) => (
                                                        <Card key={item._id} type="album" item={item} />
                                                    ))}
                                                </>
                                                : selectedChipSecondPanel === "1"
                                                    ? <>
                                                        {singleAndEpData?.map((item) => (
                                                            <Card key={item._id} type="album" item={item} />
                                                        ))}
                                                    </>
                                                    : <>
                                                        {sortOldestReleased(singleAndEpData)?.map((item) => (
                                                            <Card key={item._id} type="album" item={item} />
                                                        ))}
                                                    </>
                                            }
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel value="2" className="tab-panel third">
                                    <div className="chips">
                                        <Chip
                                            label="Mới nhất"
                                            clickable
                                            className={`chip ${selectedChipThirdPanel === "0" && "selected"}`}
                                            onClick={() => setSelectedChipThirdPanel("0")}
                                        />
                                        <Chip
                                            label="Phổ biến"
                                            clickable
                                            className={`chip ${selectedChipThirdPanel === "1" && "selected"}`}
                                            onClick={() => setSelectedChipThirdPanel("1")}
                                        />
                                        <Chip
                                            label="Cũ nhất"
                                            clickable
                                            className={`chip ${selectedChipThirdPanel === "2" && "selected"}`}
                                            onClick={() => setSelectedChipThirdPanel("2")}
                                        />
                                    </div>
                                    <div className="contents">
                                        <div className="cards custom">
                                            {selectedChipThirdPanel === "0"
                                                ? <>
                                                    {sortNewestReleased(albumData)?.map((item) => (
                                                        <Card key={item._id} type="album" item={item} />
                                                    ))}
                                                </>
                                                : selectedChipThirdPanel === "1"
                                                    ? <>
                                                        {albumData?.map((item) => (
                                                            <Card key={item._id} type="album" item={item} />
                                                        ))}
                                                    </>
                                                    : <>
                                                        {sortOldestReleased(albumData)?.map((item) => (
                                                            <Card key={item._id} type="album" item={item} />
                                                        ))}
                                                    </>
                                            }
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel value="3" className="tab-panel fourth">
                                    <div className="chips">
                                        <Chip
                                            label="Mới nhất"
                                            clickable
                                            className={`chip ${selectedChipFourthPanel === "0" && "selected"}`}
                                            onClick={() => setSelectedChipFourthPanel("0")}
                                        />
                                        <Chip
                                            label="Phổ biến"
                                            clickable
                                            className={`chip ${selectedChipFourthPanel === "1" && "selected"}`}
                                            onClick={() => setSelectedChipFourthPanel("1")}
                                        />
                                        <Chip
                                            label="Cũ nhất"
                                            clickable
                                            className={`chip ${selectedChipFourthPanel === "2" && "selected"}`}
                                            onClick={() => setSelectedChipFourthPanel("2")}
                                        />
                                    </div>
                                    <div className="contents">
                                        <div className="cards custom">
                                            {selectedChipFourthPanel === "0"
                                                ?
                                                <>
                                                    {sortNewestReleased(appearsOnData)?.map((item) => (
                                                        <Card key={item._id} type="album" item={item} />
                                                    ))}
                                                </>
                                                : selectedChipFourthPanel === "1"
                                                    ?
                                                    <>
                                                        {appearsOnData?.map((item) => (
                                                            <Card key={item._id} type="album" item={item} />
                                                        ))}
                                                    </>
                                                    :
                                                    <>
                                                        {sortOldestReleased(appearsOnData)?.map((item) => (
                                                            <Card key={item._id} type="album" item={item} />
                                                        ))}
                                                    </>
                                            }
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel value="4" className="tab-panel fifth">
                                    <div className="artist-img">
                                        <Carousel
                                            autoPlay={false}
                                            navButtonsAlwaysVisible
                                            cycleNavigation={false}
                                            animation="slide"
                                            duration="500"
                                            className="carousel"
                                        >
                                            {artistData?.images?.map((img) => (
                                                <div className="wrapper-img" onClick={() => { !isTouchDevice && handleClick(img.src) }} key={artistData?._id}>
                                                    <img src={img.src} alt="Artist's img" />
                                                </div>
                                            ))}
                                        </Carousel>
                                        <Modal
                                            open={openModal}
                                            onClose={() => setOpenModal(false)}
                                            closeAfterTransition
                                            className="modal"
                                        >
                                            <Grow in={openModal}>
                                                <div className="wrapper-img">
                                                    <div className="wrapper-icon" onClick={() => setOpenModal(false)}>
                                                        <CloseIcon className="icon close" />
                                                    </div>
                                                    <img src={imgSrc} alt="Artist's img" />
                                                </div>
                                            </Grow>
                                        </Modal>
                                    </div>
                                    <div className="artist-info">
                                        <div className="artist-info-left">
                                            <div className="wrapper-left">
                                                <section className="followers">
                                                    <p className="number">{(1023090 + artistData?.followers?.length).toLocaleString('en-US')}</p>
                                                    <p className="title">Nguời theo dõi</p>
                                                </section>
                                                <section className="monthly-listeners">
                                                    <p className="number">10,450,651</p>
                                                    <p className="title">Lượt nghe mỗi tháng</p>
                                                </section>
                                                <section className="contact">
                                                    <div className="facebook">
                                                        <FacebookRoundedIcon className="icon facebook" />
                                                        <span className="text">Facebook</span>
                                                    </div>
                                                    <div className="insta">
                                                        <InstagramIcon className="icon insta" />
                                                        <span className="text">Instagram</span>
                                                    </div>
                                                    <div className="twitter">
                                                        <TwitterIcon className="icon twitter" />
                                                        <span className="text">Twitter</span>
                                                    </div>
                                                    <div className="wiki">
                                                        <OpenInNewIcon className="icon wiki" />
                                                        <span className="text">Wikipedia</span>
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                                        <div className="artist-info-right">
                                            <div className="wrapper-right">
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                Atque quisquam aliquam corporis aperiam aut laborum obcaecati amet?
                                                Quia porro animi officiis, fuga explicabo illum repellendus accusantium velit asperiores iusto dolor?
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                Atque quisquam aliquam corporis aperiam aut laborum obcaecati amet?
                                                Quia porro animi officiis, fuga explicabo illum repellendus accusantium velit asperiores iusto dolor?
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                Atque quisquam aliquam corporis aperiam aut laborum obcaecati amet?
                                                Quia porro animi officiis, fuga explicabo illum repellendus accusantium velit asperiores iusto dolor?
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                Atque quisquam aliquam corporis aperiam aut laborum obcaecati amet?
                                                Quia porro animi officiis, fuga explicabo illum repellendus accusantium velit asperiores iusto dolor?
                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>
                            </div>
                        </TabContext>
                    </section>
                </div>
            </div>
        </div>
    )
}
