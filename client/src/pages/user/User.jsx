import "./user.scss";
import noAvatar from "../../images/noAvatar.png";
import adminImg from "../../images/defaultAvatar.png";
import { ColorExtractor } from "react-color-extractor";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useLocation, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Input, InputLabel, Skeleton } from "@mui/material";
import Card from "../../components/card/Card";
import FollowButton from "../../components/buttons/followButton/FollowButton";
import EditIcon from '@mui/icons-material/Edit';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import axios from "axios";

export default function User() {
    const [colors, setColors] = useState([]);
    const { user, dispatch } = useContext(AuthContext);
    const params = useParams();
    const location = useLocation();
    const title = location.state?.title;
    const userId = params.id;
    const { data, loading } = useFetch("/users/find/" + userId);
    const [openFollowing, setOpenFollowing] = useState(false);
    const [openFollowers, setOpenFollowers] = useState(false);
    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const usernameRef = useRef();
    const [file, setFile] = useState("");
    const [currentFile, setCurrentFile] = useState(user?.img ? user.img : noAvatar);
    const [imgSrc, setImgSrc] = useState("");
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    useEffect(() => {
        if (data?.isAdmin) {
            return setImgSrc(adminImg);
        }
        if (data?.img) {
            return setImgSrc(data.img);
        } else {
            return setImgSrc(noAvatar);
        }
    }, [data]);

    useEffect(() => {
        const userBackground = document.querySelector(".user-background");
        if (colors.length > 0 && userBackground) {
            userBackground.style.setProperty("--color", colors[1]);
        }
    }, [colors]);


    useEffect(() => {
        document.title = (title ? title : data?.name) + " - Profile";
    }, [data, title]);

    useEffect(() => {
        if (file) {
            const urlFile = URL.createObjectURL(file);
            setCurrentFile(urlFile);
        }
    }, [file]);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const username = usernameRef?.current?.value;
        const img = user?.img || noAvatar;
        setLoadingSubmit(true);
        if (currentFile !== img) {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "upload");
            const uploadRes = await axios.post(
                "https://api.cloudinary.com/v1_1/dmtcuxsce/image/upload",
                data
            );

            const { url } = uploadRes.data;

            await axios.put(process.env.REACT_APP_API_URL + "/users/" + user?._id, {
                name: username,
                img: url
            }, { withCredentials: true });

            await dispatch({
                type: "UPDATE", payload: {
                    ...user,
                    name: username,
                    img: url
                }
            });

            setImgSrc(url);
        } else {
            await axios.put(process.env.REACT_APP_API_URL + "/users/" + user?._id, {
                name: username,
            }, { withCredentials: true });

            await dispatch({
                type: "UPDATE", payload: {
                    ...user,
                    name: username,
                    img: user?.img
                }
            });
        }
        setLoadingSubmit(false);
        setOpenDialogEdit(false);
    };

    return (
        <div className="user">
            <div className="user-wrapper">
                <div className="user-top">
                    {loading
                        ? <Skeleton variant="rounded" className="skeleton" height="44vh" sx={{ marginBottom: "15px" }} />
                        :
                        <div className="user-background">
                            <ColorExtractor getColors={(colors) => { setColors(colors) }} >
                                <img
                                    src={imgSrc}
                                    alt={`Avatar của ${data?.isAdmin ? "vibe" : data?.name}`}
                                />
                            </ColorExtractor>
                        </div>
                    }
                    <div className="user-header">
                        <div className="user-header-left">
                            <div className="first">
                                <div className="user-avatar">
                                    {loading
                                        ? <Skeleton variant="circular" className="skeleton" />
                                        : <img
                                            src={imgSrc}
                                            alt={`Avatar của ${data?.isAdmin ? "vibe" : data?.name}`}
                                        />}
                                </div>
                            </div>
                            <div className="second">
                                <div className="second-top">
                                    <div className="user-name">
                                        <h3 className="text">
                                            {loading
                                                ? <Skeleton variant="text" className="skeleton" width={200} />
                                                : data?.isAdmin
                                                    ? "vibe"
                                                    : data?._id === user?._id
                                                        ? user?.name
                                                        : data?.name}
                                        </h3>
                                    </div>
                                    {loading
                                        ? <Skeleton variant="circular" className="skeleton" width={40} height={40} />
                                        : user?._id !== userId
                                            ? <FollowButton id={data?._id} type="user" />
                                            : user && <EditIcon className="icon edit" onClick={() => setOpenDialogEdit(true)} />
                                    }
                                </div>
                                <div className="second-below">
                                    {loading
                                        ? <Skeleton variant="text" className="skeleton" width={400} />
                                        :
                                        <ul>
                                            <li className="user-playlists">
                                                <b>{data?.playlists?.length.toLocaleString("en-US")}</b> <span>Playlist công khai</span>
                                            </li>
                                            <li className="user-following">
                                                <b>{data?.followings?.length.toLocaleString("en-US")}</b> <span onClick={() => data?.followings?.length > 0 && setOpenFollowing(true)}>Following</span>
                                            </li>
                                            <li className="user-follower">
                                                <b>{data?.followers?.length.toLocaleString("en-US")}</b> <span onClick={() => data?.followers?.length > 0 && setOpenFollowers(true)}>Followers</span>
                                            </li>
                                        </ul>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="user-header-middle">
                            {loading
                                ? <Skeleton variant="text" className="skeleton" width={400} />
                                :
                                <ul>
                                    <li className="user-playlists">
                                        <b>{data?.playlists?.length.toLocaleString("en-US")}</b> <span>Playlist công khai</span>
                                    </li>
                                    <li className="user-following" >
                                        <b>{data?.followings?.length.toLocaleString("en-US")}</b> <span onClick={() => data?.followings?.length > 0 && setOpenFollowing(true)} >Following</span>
                                    </li>
                                    <li className="user-follower">
                                        <b>{data?.followers?.length.toLocaleString("en-US")}</b> <span onClick={() => data?.followers?.length > 0 && setOpenFollowers(true)}>Followers</span>
                                    </li>
                                </ul>
                            }
                        </div>
                    </div>
                </div>
                <div className="user-bottom">
                    <h3 className="title">Các playlist công khai</h3>
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
                            : data?.playlists?.length > 0
                                ? data?.playlists?.map((item, index) => (
                                    <Card key={index} type="playlist" item={item} />
                                ))
                                : "Người dùng không có playlist công khai nào"
                        }
                    </div>
                </div>
                <Dialog open={openDialogEdit} onClose={() => setOpenDialogEdit(false)} className="user-edit-dialog">
                    <DialogTitle className="title">
                        <span>Chỉnh sửa Profile</span>
                        <CancelRoundedIcon
                            className="icon close"
                            onClick={() => setOpenDialogEdit(false)}
                        />
                    </DialogTitle>
                    <DialogContent className="content">
                        <div className="avatar">
                            <input
                                type="file"
                                id="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                style={{ display: "none" }}
                            />
                            <div className="user-img">
                                <img
                                    src={currentFile}
                                    alt="User's img"
                                />
                            </div>
                            <label htmlFor="file" className="upload-button">
                                Tải lên
                            </label>
                        </div>
                        <form onSubmit={handleOnSubmit}>
                            <div className="form-group">
                                <InputLabel variant="standard" htmlFor="user-name" className="form-label">
                                    Tên:
                                </InputLabel>
                                <Input
                                    id="user-name"
                                    placeholder="Tên bạn muốn được gọi"
                                    className="form-input user-name"
                                    required
                                    defaultValue={user?.name}
                                    inputProps={{ maxLength: 10 }}
                                    inputRef={usernameRef}
                                />
                            </div>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <button className="save-button" onClick={handleOnSubmit} disabled={loadingSubmit}>
                            Lưu
                        </button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openFollowing} onClose={() => setOpenFollowing(false)} className="user-following-dialog">
                    <DialogTitle className="title">Following</DialogTitle>
                    <DialogContent className="content">
                        {data?.followings?.map((item, index) => (
                            <div className="item" key={index}>
                                <div className="item-left">
                                    <div className="img">
                                        <img
                                            src={item.type === "user"
                                                ? (item.isAdmin ? adminImg : !item.img
                                                    ? noAvatar : item.img)
                                                : item.images[0].src}
                                            alt="avatar"
                                        />
                                    </div>
                                    <div className="name">
                                        <p className="text" onClick={() => setOpenFollowing(false)}>
                                            <Link
                                                to={`/${item.type}s/${item._id}`}
                                                state={{ title: item.name }}
                                            >
                                                {item.name}
                                            </Link>
                                        </p>
                                        <p className="type">
                                            {item.type === "artist" ? "Nghệ sĩ" : "Người dùng"}
                                        </p>
                                    </div>
                                </div>
                                <div className="item-right">
                                    <FollowButton id={item._id} type={item.type} />
                                </div>
                            </div>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <button className="cancel-button" onClick={() => setOpenFollowing(false)}>
                            Đóng
                        </button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openFollowers} onClose={() => setOpenFollowers(false)} className="user-followers-dialog">
                    <DialogTitle className="title">Followers</DialogTitle>
                    <DialogContent className="content">
                        {data?.followers?.map((item, index) => (
                            <div className="item" key={index}>
                                <div className="item-left">
                                    <div className="img">
                                        <img
                                            src={item.isAdmin ? adminImg : !item.img
                                                ? noAvatar : item.img}
                                            alt="avatar"
                                        />
                                    </div>
                                    <div className="name" onClick={() => setOpenFollowers(false)}>
                                        <Link
                                            to={`/${item.type}s/${item._id}`}
                                            state={{ title: item.name }}
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="type">
                                            {item.type === "artist" ? "Nghệ sĩ" : "Người dùng"}
                                        </p>
                                    </div>
                                </div>
                                {item._id !== user?._id &&
                                    <div className="item-right">
                                        <FollowButton id={item._id} type={item.type} />
                                    </div>
                                }
                            </div>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <button className="cancel-button" onClick={() => setOpenFollowers(false)}>
                            Đóng
                        </button>
                    </DialogActions>
                </Dialog>
            </div>
        </div >
    )
}
