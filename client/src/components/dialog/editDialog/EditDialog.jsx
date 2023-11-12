import "./editDialog.scss";
import CancelIcon from '@mui/icons-material/Cancel';
import { Dialog, Input, InputLabel, NativeSelect } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

export default function EditDialog({ setOpenDialogEdit, openDialogEdit, item }) {
    const [file, setFile] = useState("");
    const [currentFile, setCurrentFile] = useState(item?.images[0]);
    const nameRef = useRef();
    const descRef = useRef();
    const typeRef = useRef();
    const { dispatch, user } = useContext(AuthContext);

    useEffect(() => {
        if (file) {
            const urlFile = URL.createObjectURL(file);
            setCurrentFile(urlFile);
        }
    }, [file]);

    const handleOnClose = () => {
        setOpenDialogEdit(false);
        setCurrentFile(item?.images[0]);
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const playlistName = nameRef?.current?.value;
            const playlistDesc = descRef?.current?.value;
            const playlistType = typeRef?.current?.value === "true" ? true : false;
            if (currentFile !== item?.images[0]) {
                const data = new FormData();
                data.append("file", file);
                data.append("upload_preset", "upload");
                const uploadRes = await axios.post(
                    "https://api.cloudinary.com/v1_1/dmtcuxsce/image/upload",
                    data
                );

                const { url } = uploadRes.data;

                await axios.put(process.env.REACT_APP_API_URL + "/playlists/" + item?._id, {
                    name: playlistName,
                    desc: playlistDesc,
                    public: playlistType,
                    images: [url]
                });

                const updatedPlaylists = user.playlists.map(playlist => {
                    if (playlist._id === item?._id) {
                        return {
                            name: playlistName,
                            owner: playlist.owner,
                            public: playlistType,
                            _id: playlist._id
                        };
                    } else {
                        return playlist;
                    }
                })

                await dispatch({
                    type: "UPDATE", payload: {
                        ...user,
                        playlists: updatedPlaylists
                    }
                });
            } else {
                await axios.put(process.env.REACT_APP_API_URL + "/playlists/" + item?._id, {
                    name: playlistName,
                    desc: playlistDesc,
                    public: playlistType,
                    images: [currentFile]
                }
                );

                const updatedPlaylists = user.playlists.map(playlist => {
                    if (playlist._id === item?._id) {
                        return {
                            name: playlistName,
                            owner: playlist.owner,
                            public: playlistType,
                            _id: playlist._id
                        };
                    } else {
                        return playlist;
                    }
                })

                await dispatch({
                    type: "UPDATE", payload: {
                        ...user,
                        playlists: updatedPlaylists
                    }
                });
            }
            setOpenDialogEdit(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog
            open={openDialogEdit}
            onClose={handleOnClose}
            className="edit-dialog"
        >
            <div className="wrapper-dialog">
                <div className="dialog-top">
                    <CancelIcon
                        className="icon cancel"
                        onClick={handleOnClose}
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
                            <form onSubmit={handleOnSubmit}>
                                <div className="form-group">
                                    <InputLabel variant="standard" htmlFor="playlist-name" className="form-label">
                                        Tên:
                                    </InputLabel>
                                    <Input
                                        id="playlist-name"
                                        placeholder="Nhập tên playlist"
                                        className="form-input name"
                                        required
                                        defaultValue={item?.name}
                                        inputProps={{ maxLength: 50 }}
                                        inputRef={nameRef}
                                    />
                                </div>
                                <div className="form-group">
                                    <InputLabel variant="standard" htmlFor="playlist-desc" className="form-label">
                                        Mô tả (không bắt buộc):
                                    </InputLabel>
                                    <Input
                                        id="playlist-desc"
                                        placeholder="Tối đa 200 ký tự"
                                        className="form-input desc"
                                        defaultValue={item?.desc}
                                        multiline
                                        rows={4}
                                        inputProps={{ maxLength: 200 }}
                                        inputRef={descRef}
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
                                        defaultValue={item?.public}
                                        inputRef={typeRef}
                                    >
                                        <option value={false}>Riêng tư</option>
                                        <option value={true}>Công khai</option>
                                    </NativeSelect>
                                </div>
                                <div className="button">
                                    <button
                                        className="save-button"
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
