import PlaylistItem from "../../components/playlistItem/PlaylistItem";
import "./myPlaylists.scss";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useContext, useEffect, useState } from "react";
import AddDialog from "../../components/dialog/addDialog/AddDialog";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function MyPlaylists() {
    const [openDialogAdd, setOpenDialogAdd] = useState(false);
    const { user } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                const res = await axios.get(process.env.REACT_APP_API_URL + "/me/playlists");
                setData(res.data);
                setLoading(false);
            };
            fetchData();
        }
    }, [user]);

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
                    {loading
                        ? "Đang load, đợi tí nha"
                        : data?.length === 0
                            ? <p>Bạn chưa có playlist nào. Hãy kiếm thêm các bài hát để làm đầy không gian này</p>
                            : data.map(item => (
                                <PlaylistItem key={item._id} item={item} />
                            ))}
                </div>
            </div>
        </div>
    )
}
