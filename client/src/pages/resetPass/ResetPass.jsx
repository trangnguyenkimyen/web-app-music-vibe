import { useNavigate, useParams } from "react-router-dom";
import "./resetPass.scss";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Alert, Collapse, IconButton } from '@mui/material';
import React from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';


export default function ResetPass() {
    const params = useParams();
    const token = params.token;
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const passRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);

    useEffect(() => {
        if (token) {
            const verifyToken = async () => {
                try {
                    const res = await axios.get(process.env.REACT_APP_API_URL + "/auth/reset-password/" + token);
                    setEmail(res.data);
                } catch (error) {
                    console.log(error);
                }
            };
            verifyToken();
        }
    }, [token, navigate]);

    const handleOnClickShowPassword = () => {
        setShowPassword(!showPassword);
        passRef?.current?.focus();
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await axios.put(process.env.REACT_APP_API_URL + "/users/reset-pass/" + email, {
                password: passRef?.current?.value
            });
            setOpenSuccess(true);
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };

    return (
        <div className="reset-pass">
            <div className="wrapper-reset-pass">
                <form onSubmit={handleOnSubmit}>
                    <h1 className="title">Thay đổi mật khẩu</h1>
                    <div className="form-control">
                        <label htmlFor="password">Mật khẩu mới</label>
                        <div className="wrapper-password">
                            <input
                                className="password"
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                minLength="6"
                                placeholder="Mật khẩu có ít nhất 6 chữ số"
                                ref={passRef}
                                required
                            />
                            <div className="wrapper-icon" onClick={handleOnClickShowPassword}>
                                {showPassword
                                    ? <VisibilityIcon className="icon" />
                                    : <VisibilityOffIcon className="icon" />
                                }
                            </div>
                        </div>
                    </div>
                    <button className="login-button" disabled={isLoading}>
                        Thay đổi mật khẩu
                    </button>
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
                            Thay đổi thành công! Bây giờ bạn có thể tiếp tục <b><a href="/login" className="link">đăng nhập</a></b> với mật khẩu mới
                        </Alert>
                    </Collapse>
                </form>
            </div>
        </div>
    )
}
