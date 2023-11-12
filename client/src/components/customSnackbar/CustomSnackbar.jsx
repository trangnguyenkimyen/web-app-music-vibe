import { IconButton, Slide, Snackbar } from "@mui/material";
import "./customSnackbar.scss";
import CloseIcon from '@mui/icons-material/Close';

function SlideTransition(props) {
    return <Slide {...props} direction="right" />;
};

export default function CustomSnackbar({ openSnackbar, setOpenSnackbar, message }) {
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    return (
        <Snackbar
            className="snackbar"
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
            }}
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            TransitionComponent={SlideTransition}
            TransitionProps={{
                in: openSnackbar,
                timeout: 350
            }}
            message={message}
            action={
                <IconButton onClick={handleCloseSnackbar}>
                    <CloseIcon />
                </IconButton>
            }
            style={{
                position: "fixed",
                left: "12px",
                bottom: "110px", // Điều chỉnh khoảng cách bottom theo ý muốn
                zIndex: 9999 // Điều chỉnh z-index theo ý muốn
            }}
        />
    )
}
