 
import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import type { SnackbarCloseReason } from '@mui/material/Snackbar';


interface Props {
    type: string | any;
    message: string;
    duration?: number;
}

function CustomAlert({ type, message, duration=2500 }: Props) {
    const [open, setOpen] = useState(true);

    const origin: any = {
        vertical: "top",
        horizontal: "left"
    }

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
      ) => {
        console.log(event)
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar
            open={open} autoHideDuration={duration} onClose={handleClose} anchorOrigin={origin}
        >
            <Alert
                onClose={handleClose}
                severity={type}
                variant={"standard"}
                sx={{ width: '100%', fontFamily: 'inherit', fontSize: '1.6rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default CustomAlert