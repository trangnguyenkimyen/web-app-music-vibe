import { Popover } from "@mui/material";
import "./loginPopover.scss";
import { Link } from "react-router-dom";

export default function LoginPopover({ open, anchorEl, setOpen, title, content }) {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <div className="login-popover">
                <div className="content">
                    <h4>{title}</h4>
                    <p>{content}</p>
                </div>
                <div className="buttons">
                    <button className="exit" onClick={handleClose}>Thoát</button>
                    <button className="log-in" onClick={handleClose}>
                        <Link to="/login">
                            Đăng nhập
                        </Link>
                    </button>
                </div>
            </div>
        </Popover>
    )
}
