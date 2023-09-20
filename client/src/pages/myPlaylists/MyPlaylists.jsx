import PlaylistItem from "../../components/playlistItem/PlaylistItem";
import "./myPlaylists.scss";
import AddBoxIcon from '@mui/icons-material/AddBox';
import imgSrc from "../../images/song/forgetmenow.jpg";
import { useEffect, useState } from "react";
import AddDialog from "../../components/dialog/addDialog/AddDialog";

export default function MyPlaylists() {
    const [openDialogAdd, setOpenDialogAdd] = useState(false);

    useEffect(() => {
        document.title = "vibe - Playlist của bạn";
    }, []);

    return (
        <div className="my-playlists">
            <div className="my-playlists-wrapper">
                <button
                    className="add-button"
                    onClick={() => setOpenDialogAdd(true)}
                >
                    <AddBoxIcon className="icon add" />
                    <span className="text">Tạo playlist mới</span>
                </button>
                <AddDialog
                    openDialogAdd={openDialogAdd}
                    setOpenDialogAdd={setOpenDialogAdd}
                />
                <div className="playlists">
                    <PlaylistItem />
                    <PlaylistItem img={imgSrc} />
                </div>
            </div>
        </div>
    )
}
