import "./successMsg.scss";
import { Alert, Collapse, IconButton } from '@mui/material';
import React from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function SuccessMsg({ openSuccess, setOpenSuccess, msg }) {
    return (
        <Collapse in={openSuccess} sx={{ width: '100%' }}>
            <Alert
                severity="success"
                action={
                    <IconButton
                        aria-label="close"
                        size="small"
                        onClick={() => {
                            setOpenSuccess(false);
                        }}
                        className="close-button"
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                }
            >
                {msg}
            </Alert>
        </Collapse>
    )
}

