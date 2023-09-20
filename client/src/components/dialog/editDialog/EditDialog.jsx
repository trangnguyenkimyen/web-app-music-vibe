import "./editDialog.scss";
import imgSrc from "../../../images/defaultPlaylist.png";
import CancelIcon from '@mui/icons-material/Cancel';
import { Dialog, Input, InputLabel, NativeSelect } from "@mui/material";
import { useEffect, useState } from "react";

export default function EditDialog({ setOpenDialogEdit, openDialogEdit, img }) {
    const [playlistType, setPlaylistType] = useState("private");
    const [playlistName, setPlaylistName] = useState("Playlist name");
    const [file, setFile] = useState("");
    const [currentFile, setCurrentFile] = useState("");

    useEffect(() => {
        if (img) {
            setCurrentFile(img);
        } else {
            setCurrentFile(imgSrc);
        }
    }, [img]);

    useEffect(() => {
        if (file) {
            const urlFile = URL.createObjectURL(file);
            setCurrentFile(urlFile);
        }
    }, [file]);

    return (
        <Dialog
            open={openDialogEdit}
            onClose={() => setOpenDialogEdit(false)}
            className="dialog"
        >
            <div className="wrapper-dialog">
                <div className="dialog-top">
                    <CancelIcon
                        className="icon cancel"
                        onClick={() => setOpenDialogEdit(false)}
                    />
                    <div className="title">
                        <h3 className="text">Chỉnh sửa playlist</h3>
                    </div>
                </div>
                <div className="dialog-bottom">
                    <div className="dialog-bottom-left">
                        <div className="wrapper-left">
                            <input
                                type="file"
                                id="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                style={{ display: "none" }}
                            />
                            <div className="playlist-img">
                                <img
                                    src={currentFile}
                                    alt="Playlist's img"
                                />
                            </div>
                            <label htmlFor="file" className="upload-button">
                                Tải lên
                            </label>
                        </div>
                    </div>
                    <div className="dialog-bottom-right">
                        <div className="wrapper-right">
                            <div className="form-group">
                                <InputLabel variant="standard" htmlFor="playlist-name" className="form-label">
                                    Tên:
                                </InputLabel>
                                <Input
                                    id="playlist-name"
                                    placeholder="Nhập tên playlist"
                                    className="form-input name"
                                    required
                                    value={playlistName}
                                    onChange={(e) => setPlaylistName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <InputLabel variant="standard" htmlFor="playlist-type" className="form-label">
                                    Quyền riêng tư:
                                </InputLabel>
                                <NativeSelect
                                    inputProps={{
                                        name: 'type',
                                        id: 'playlist-type',
                                    }}
                                    className="form-input type"
                                    value={playlistType}
                                    onChange={(e) => setPlaylistType(e.target.value)}
                                >
                                    <option value="private">Riêng tư</option>
                                    <option value="public">Công khai</option>
                                </NativeSelect>
                            </div>
                            <button
                                className="save-button"
                                onClick={() => setOpenDialogEdit(false)}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
