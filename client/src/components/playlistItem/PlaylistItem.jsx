import "./playlistItem.scss";
import imgSrc from "../../images/defaultPlaylist.png";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import EditDialog from "../dialog/editDialog/EditDialog";
import DeleteDialog from "../dialog/deleteDialog/DeleteDialog";

export default function PlaylistItem({ item }) {
    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);

    return (
        <div className="playlist-item">
            <div className="playlist-item-wrapper">
                <Link to={`/playlists/${item?._id}`}>
                    <div className="playlist-item-left">
                        <div className="playlist-img">
                            <img src={item?.images[0] ? item?.images[0] : imgSrc} alt={item?.name} />
                        </div>
                        <div className="playlist-info">
                            <p className="name">{item?.name}</p>
                            <p className="type">{item?.public ? "Công khai" : "Riêng tư"}</p>
                        </div>
                    </div>
                </Link>
                <div className="playlist-item-right">
                    <Tooltip title="Chỉnh sửa playlist" disableInteractive>
                        <EditIcon
                            className="icon edit"
                            onClick={() => setOpenDialogEdit(true)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa playlist" disableInteractive>
                        <DeleteForeverIcon
                            className="icon delete"
                            onClick={() => setOpenDialogDelete(true)}
                        />
                    </Tooltip>
                    <EditDialog
                        openDialogEdit={openDialogEdit}
                        setOpenDialogEdit={setOpenDialogEdit}
                        item={item}
                    />
                    <DeleteDialog
                        openDialogDelete={openDialogDelete}
                        setOpenDialogDelete={setOpenDialogDelete}
                        item={item}
                    />
                </div>
            </div>
        </div>
    )
}
