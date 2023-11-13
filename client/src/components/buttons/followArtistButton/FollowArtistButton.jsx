import "./followArtistButton.scss";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useContext, useEffect, useRef, useState } from "react";
import { Tooltip } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import LoginPopover from "../../loginPopover/LoginPopover";
import axios from "axios";
import CustomSnackbar from "../../customSnackbar/CustomSnackbar";

export default function FollowArtistButton({ id }) {
    const [followed, setFollowed] = useState(false);
    const { user, dispatch } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [msg, setMsg] = useState("");
    const anchorRef = useRef(null);

    useEffect(() => {
        if (user) {
            if (user.followings.includes(id)) {
                return setFollowed(true);
            } else {
                return setFollowed(false);
            }
        } else {
            return setFollowed(false);
        }
    }, [user, id]);

    const handleOnClick = async () => {
        if (user) {
            await axios.put(process.env.REACT_APP_API_URL + "/me/following/" + id + "?type=artist", { withCredentials: true });
            if (user.followings.includes(id)) {
                const updatedFollowings = await user.followings.filter(item => {
                    return item !== id;
                });
                await dispatch({
                    type: "UPDATE", payload: {
                        ...user,
                        followings: updatedFollowings
                    }
                });
                setMsg("Đã ngưng theo dõi nghệ sĩ");
            } else {
                await user.followings.push(id);
                await dispatch({
                    type: "UPDATE", payload: {
                        ...user,
                        followings: user.followings
                    }
                });
                setMsg("Đã theo dõi nghệ sĩ");
            }

            if (openSnackbar) {
                setOpenSnackbar(false);
            }

            await setOpenSnackbar(true);
        } else {
            setOpen(true);
        }
    };

    return (
        <div className="follow-button">
            <Tooltip title={followed ? "Bỏ theo dõi" : "Theo dõi"} disableInteractive>
                <div className="wrapper" onClick={handleOnClick} ref={anchorRef}>
                    {followed
                        ? <FavoriteIcon className="icon followed" />
                        : <FavoriteBorderIcon className="icon unfollowed" />
                    }
                </div>
            </Tooltip>
            <LoginPopover
                open={open}
                anchorEl={anchorRef?.current}
                setOpen={setOpen}
                title="Theo dõi nghệ sĩ"
                content="Hãy đăng nhập để theo dõi nghệ sĩ bạn yêu thích nhé."
            />
            <CustomSnackbar
                openSnackbar={openSnackbar}
                setOpenSnackbar={setOpenSnackbar}
                message={msg}
            />
        </div>
    )
}
