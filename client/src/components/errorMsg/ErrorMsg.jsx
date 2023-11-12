import { Alert, Collapse, IconButton } from '@mui/material';
import React from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function ErrorMsg({ openError, setOpenError, msg }) {
    return (
        <Collapse in={openError} sx={{ width: '100%' }}>
            <Alert
                severity="error"
                action={
                    <IconButton
                        aria-label="close"
                        size="small"
                        onClick={() => {
                            setOpenError(false);
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
