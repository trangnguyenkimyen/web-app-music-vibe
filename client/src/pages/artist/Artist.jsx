import "./artist.scss";
import img from "../../images/artist/obito.jpg";
import img1 from "../../images/artist/den.jpg";
import img2 from "../../images/artist/amee.jpg";
import img3 from "../../images/artist/obito.jpg";
import img4 from "../../images/artist/bray.jpg";
import img5 from "../../images/artist/sunihalinh.jpg";
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { ColorExtractor } from "react-color-extractor";
import PlayAllArtistSongsButton from "../../components/buttons/playAllArtistSongButton/PlayAllArtistSongButton";
import FollowArtistButton from "../../components/buttons/followArtistButton/FollowArtistButton";
import SongTable from "../../components/songTable/SongTable";
import { Box, Chip, Grow, Modal, Tab } from "@mui/material";
import { TabPanel, TabContext, TabList } from "@mui/lab";
import Card from "../../components/card/Card";
import { Link } from "react-router-dom";
import Carousel from "react-material-ui-carousel";

export default function Artist() {
    const [colors, setColors] = useState([]);
    const [valueTab, setValueTab] = useState("0");
    const [selectedChipSecondPanel, setSelectedChipSecondPanel] = useState("0");
    const [selectedChipThirdPanel, setSelectedChipThirdPanel] = useState("0");
    const [selectedChipFourthPanel, setSelectedChipFourthPanel] = useState("0");
    const [openModal, setOpenModal] = useState(false);
    const [imgSrc, setImgSrc] = useState(null);
    const imgArray = [img1, img2, img3, img4, img5];

    useEffect(() => {
        const artistHeader = document.querySelector(".artist-background");
        if (colors.length > 0) {
            artistHeader.style.setProperty("--color", colors[4]);
        }
    }, [colors]);

    useEffect(() => {
        document.title = "Name of artist - Artist";
    }, []);

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
    }

    return (
        <div className="artist">
            <div className="artist-wrapper">
                <div className="artist-top">
                    <div className="artist-background">
                        <ColorExtractor getColors={(colors) => { setColors(colors) }} >
                            <img src={img} alt="Background of artist" />
                        </ColorExtractor>
                    </div>
                    <div className="artist-header">
                        <div className="left">
                            <div className="first">
                                <div className="artist-avatar">
                                    <img src={img} alt="Avatar of artist" />
                                </div>
                            </div>
                            <div className="second">
                                <div className="artist-name">
                                    <h3 className="text">Artist's name</h3>
                                </div>
                                <div className="artist-listeners">
                                    <span className="text">3,000,000 lượt nghe mỗi tháng</span>
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <PlayAllArtistSongsButton />
                            <FollowArtistButton />
                        </div>
                    </div>
                </div>
                <div className="artist-bottom" >
                    <section className="popular-songs">
                        <div className="title-section">
                            <h3 className="title-text">Các bài hát phổ biến</h3>
                        </div>
                        <div className="songs" >
                            <SongTable type="artist" />
                        </div>
                    </section>
                    <section className="tabs" >
                        <TabContext value={valueTab}>
                            <Box sx={{ borderBottom: 1, borderColor: "#96969650" }} className="tablist-box">
                                <TabList
                                    variant="fullWidth"
                                    scrollButtons="auto"
                                    textColor="inherit"
                                    onChange={(_, value) => setValueTab(value)}
                                    className="tablist"
                                >
                                    <Tab value="0" label="Bản phát hành" className="tab" />
                                    <Tab value="1" label="Single & EP" className="tab" />
                                    <Tab value="2" label="Album" className="tab" />
                                    <Tab value="3" label="Xuất hiện trong" className="tab" />
                                    <Tab value="4" label="Về nghệ sĩ" className="tab" />
                                </TabList>
                            </Box>
                            <div className="tab-panels">
                                <TabPanel value="0" className="tab-panel first" >
                                    <section className="popular-releases">
                                        <div className="title-section">
                                            <h4 className="title-text">Phổ biến</h4>
                                        </div>
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
                                    </section>
                                    <section className="single-ep">
                                        <div className="title-section">
                                            <h4 className="title-text">Single & EP</h4>
                                        </div>
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
                                    </section>
                                    <section className="album">
                                        <div className="title-section">
                                            <h4 className="title-text">Album</h4>
                                        </div>
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
                                    </section>
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
                                        <div className="cards">
                                            {selectedChipSecondPanel === "0"
                                                ?
                                                <>
                                                    {[...Array(10)].map((_, index) => (
                                                        <div className="wrapper-item">
                                                            <div className="item">
                                                                <Link to={`/albums/${index}`}>
                                                                    <Card key={index} type="album" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                                : selectedChipSecondPanel === "1"
                                                    ?
                                                    <>
                                                        {[...Array(5)].map((_, index) => (
                                                            <div className="wrapper-item">
                                                                <div className="item">
                                                                    <Link to={`/albums/${index}`}>
                                                                        <Card key={index} type="album" />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                    :
                                                    <>
                                                        {[...Array(5)].map((_, index) => (
                                                            <div className="wrapper-item">
                                                                <div className="item">
                                                                    <Link to={`/albums/${index}`}>
                                                                        <Card key={index} type="album" />
                                                                    </Link>
                                                                </div>
                                                            </div>
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
                                        <div className="cards">
                                            {selectedChipThirdPanel === "0"
                                                ?
                                                <>
                                                    {[...Array(10)].map((_, index) => (
                                                        <div className="wrapper-item">
                                                            <div className="item">
                                                                <Link to={`/albums/${index}`}>
                                                                    <Card key={index} type="album" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                                : selectedChipThirdPanel === "1"
                                                    ?
                                                    <>
                                                        {[...Array(5)].map((_, index) => (
                                                            <div className="wrapper-item">
                                                                <div className="item">
                                                                    <Link to={`/albums/${index}`}>
                                                                        <Card key={index} type="album" />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                    :
                                                    <>
                                                        {[...Array(5)].map((_, index) => (
                                                            <div className="wrapper-item">
                                                                <div className="item">
                                                                    <Link to={`/albums/${index}`}>
                                                                        <Card key={index} type="album" />
                                                                    </Link>
                                                                </div>
                                                            </div>
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
                                        <div className="cards">
                                            {selectedChipFourthPanel === "0"
                                                ?
                                                <>
                                                    {[...Array(10)].map((_, index) => (
                                                        <div className="wrapper-item">
                                                            <div className="item">
                                                                <Link to={`/playlists/${index}`}>
                                                                    <Card key={index} type="playlist" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                                : selectedChipFourthPanel === "1"
                                                    ?
                                                    <>
                                                        {[...Array(5)].map((_, index) => (
                                                            <div className="wrapper-item">
                                                                <div className="item">
                                                                    <Link to={`/playlists/${index}`}>
                                                                        <Card key={index} type="playlist" />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                    :
                                                    <>
                                                        {[...Array(5)].map((_, index) => (
                                                            <div className="wrapper-item">
                                                                <div className="item">
                                                                    <Link to={`/playlists/${index}`}>
                                                                        <Card key={index} type="playlist" />
                                                                    </Link>
                                                                </div>
                                                            </div>
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
                                            {imgArray.map((img) => (
                                                <div className="wrapper-img" onClick={() => handleClick(img)}>
                                                    <img src={img} alt="Artist's img" />
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
                                                    <p className="number">1,320,651</p>
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
