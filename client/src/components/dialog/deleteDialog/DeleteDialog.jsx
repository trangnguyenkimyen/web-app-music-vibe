import { Dialog } from "@mui/material";
import "./deleteDialog.scss";

export default function DeleteDialog({ openDialogDelete, setOpenDialogDelete }) {
    return (
        <Dialog
            open={openDialogDelete}
            onClose={() => setOpenDialogDelete(false)}
            className="dialog"
        >
            <div className="wrapper-dialog">
                <h3 className="title">Xóa Playlist</h3>
                <p className="content">
                    Playlist của bạn sẽ bị xóa khỏi thư viện cá nhân và không thể hồi phục. Bạn có muốn xóa?
                </p>
                <div className="buttons">
                    <button className="button no" onClick={() => setOpenDialogDelete(false)}>Không</button>
                    <button className="button yes" onClick={() => setOpenDialogDelete(false)}>Có</button>
                </div>
            </div>
        </Dialog>
    )
}
