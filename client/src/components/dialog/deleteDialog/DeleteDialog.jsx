import { Dialog } from "@mui/material";
import "./deleteDialog.scss";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function DeleteDialog({ openDialogDelete, setOpenDialogDelete, item }) {

    const { dispatch, user } = useContext(AuthContext);

    const handleOnClickYes = async () => {
        try {
            await axios.delete(process.env.REACT_APP_API_URL + "/playlists/" + item?._id, { withCredentials: true });
            const updatedPlaylists = user.playlists.filter(playlist => {
                return playlist._id !== item._id;
            });
            await dispatch({
                type: "UPDATE", payload: {
                    ...user,
                    playlists: updatedPlaylists
                }
            });
        } catch (error) {
            console.log(error);
        }
        setOpenDialogDelete(false);
    };

    return (
        <Dialog
            open={openDialogDelete}
            onClose={() => setOpenDialogDelete(false)}
            className="dialog"
        >
            <div className="wrapper-dialog">
                <h3 className="title">Xóa Playlist</h3>
                <p className="content">
                    Playlist <b>{item?.name}</b> sẽ bị xóa và không thể hồi phục. Bạn có muốn xóa?
                </p>
                <div className="buttons">
                    <button className="button no" onClick={() => setOpenDialogDelete(false)}>Không</button>
                    <button className="button yes" onClick={handleOnClickYes}>Có</button>
                </div>
            </div>
        </Dialog>
    )
}
