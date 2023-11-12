import { useContext, useEffect, useRef, useState } from "react";
import "./login.scss";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GoogleIcon from '@mui/icons-material/Google';
import { AuthContext } from "../../context/AuthContext";
import ErrorMsg from "../../components/errorMsg/ErrorMsg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SuccessMsg from "../../components/successMsg/SuccessMsg";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
// import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
    const [isRegis, setIsRegis] = useState(false);
    const [showPasswordLogin, setShowPasswordLogin] = useState(false);
    const [showPasswordRegister, setShowPasswordRegister] = useState(false);
    const [openErrorLogin, setOpenErrorLogin] = useState(false);
    const [openErrorRegister, setOpenErrorRegister] = useState(false);
    const [openErrorResetPass, setOpenErrorResetPass] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openSuccessReset, setOpenSuccessReset] = useState(false);
    const [openMsg, setOpenMsg] = useState(false);
    const [openResetPass, setOpenResetPass] = useState(false);
    const emailLoginRef = useRef();
    const passLoginRef = useRef();
    const usernameRef = useRef();
    const emailRegisterRef = useRef();
    const passRegisterRef = useRef();
    const resetEmailRef = useRef();
    const { user, loading, error, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const [errorRegister, setErrorRegister] = useState(null);
    const [errorLogin, setErrorLogin] = useState(null);
    const [errorResetPass, setErrorResetPass] = useState(null);
    const [loadingRegister, setLoadingRegister] = useState(false);
    const [loadingResetPass, setLoadingResetPass] = useState(false);

    const params = useParams();
    const token = params.token;

    useEffect(() => {
        if (token) {
            const verifyEmailUrl = async () => {
                try {
                    await axios.get(process.env.REACT_APP_API_URL + "/auth/verify/" + token);
                    setOpenSuccess(true);
                } catch (error) {
                    console.log(error);
                }
            };
            verifyEmailUrl();
        }
    }, [token]);

    const handleOnClickShowPasswordLogin = () => {
        setShowPasswordLogin(!showPasswordLogin);
        passLoginRef?.current?.focus();
    };

    const handleOnClickShowPasswordRegister = () => {
        setShowPasswordRegister(!showPasswordRegister);
        passRegisterRef?.current?.focus();
    };

    const handleOnSubmitLogin = async (e) => {
        e.preventDefault();
        const email = emailLoginRef?.current?.value;
        const password = passLoginRef?.current?.value;
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await axios.post(process.env.REACT_APP_API_URL + "/auth/login", {
                email: email,
                password: password
            });
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
            navigate("/");
        } catch (error) {
            dispatch({ type: "LOGIN_FAILURE", payload: error });
            const status = error.response.data.status;
            if (status === 404) {
                setErrorLogin("Không tìm thấy người dùng...");
            } else if (status === 401) {
                setErrorLogin("Hmmm, mật khẩu hơi sai sai");
            } else {
                setErrorLogin(error.response.data.message);
            }
            setOpenSuccess(false);
            return setOpenErrorLogin(true);
        }
    };

    const handleOnSubmitRegister = async (e) => {
        e.preventDefault();
        const username = usernameRef?.current?.value;
        const email = emailRegisterRef?.current?.value;
        const password = passRegisterRef?.current?.value;
        try {
            setLoadingRegister(true);
            await axios.post(process.env.REACT_APP_API_URL + "/auth/register", {
                name: username,
                email: email,
                password: password,
                provider: ""
            });
            setOpenMsg(true);
            setOpenErrorRegister(false);
        } catch (error) {
            const status = error.response.data.status;
            if (status === 403) {
                setErrorRegister("Email này đã tồn tại");
                setOpenErrorRegister(true);
                setOpenMsg(false);
            } else {
                console.log(error);
            }
        }
        setLoadingRegister(false);
    };

    const handleOnClickResetPass = async () => {
        const email = resetEmailRef?.current?.value;
        if (email === "") {
            return;
        }
        try {
            setLoadingResetPass(true);
            await axios.post(process.env.REACT_APP_API_URL + "/auth/reset-password", {
                email: email
            });
            setOpenSuccessReset(true);
            setOpenErrorResetPass(false);
        } catch (error) {
            const status = error.response.data.status;
            if (status === 404) {
                setErrorResetPass("Không tìm thấy người dùng...");
                setOpenErrorResetPass(true);
                setOpenSuccessReset(false);
            } else {
                console.log(error);
            }
        }
        setLoadingResetPass(false);
    };

    return (
        <div className="login">
            <div className="login-wrapper">
                <div className={`login-container ${isRegis && "right-panel-active"}`}>
                    <div className="login-form">
                        <form onSubmit={handleOnSubmitLogin}>
                            <h1 className={`title ${openSuccess}`}>Đăng nhập</h1>
                            <div className="form-control">
                                <label htmlFor="email">Email</label>
                                <input
                                    className="email"
                                    id="email"
                                    type="email"
                                    placeholder="vd: vibe@gmail.com"
                                    ref={emailLoginRef}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label htmlFor="password">Mật khẩu</label>
                                <div className="wrapper-password">
                                    <input
                                        className="password"
                                        id="password"
                                        type={showPasswordLogin ? 'text' : 'password'}
                                        minLength="6"
                                        placeholder="Mật khẩu có ít nhất 6 chữ số"
                                        ref={passLoginRef}
                                        required
                                    />
                                    <div className="wrapper-icon" onClick={handleOnClickShowPasswordLogin}>
                                        {showPasswordLogin
                                            ? <VisibilityIcon className="icon" />
                                            : <VisibilityOffIcon className="icon" />
                                        }
                                    </div>
                                </div>
                            </div>
                            <SuccessMsg openSuccess={openSuccess} setOpenSuccess={setOpenSuccess} msg="Đăng ký thành công! Bạn hãy nhập lại tài khoản vừa đăng ký nhé" />
                            <ErrorMsg openError={openErrorLogin} setOpenError={setOpenErrorLogin} msg={errorLogin} />
                            <p
                                className={`forget-pass ${openErrorLogin || openSuccess}`}
                                onClick={() => setOpenResetPass(!openResetPass)}
                            >
                                Bạn quên mật khẩu?
                            </p>
                            <button className="login-button" disabled={loading}>
                                Đăng nhập
                            </button>
                        </form>
                        <Dialog open={openResetPass} onClose={() => setOpenResetPass(false)} className="reset-password">
                            <DialogTitle className="title">Đặt lại mật khẩu của bạn</DialogTitle>
                            <DialogContent>
                                <DialogContentText className="content">
                                    Để đặt lại mật khẩu, hãy nhập email của bạn bên dưới và click nút "Reset". Một email sẽ được gửi cho bạn kèm theo hướng dẫn về cách hoàn tất quy trình.
                                </DialogContentText>
                                <div className="form-control">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        className="email"
                                        id="email"
                                        type="email"
                                        placeholder="vd: vibe@gmail.com"
                                        ref={resetEmailRef}
                                    />
                                </div>
                                <SuccessMsg openSuccess={openSuccessReset} setOpenSuccess={setOpenSuccessReset} msg="Hướng dẫn đặt lại mật khẩu đã được gửi tới email của bạn" />
                                <ErrorMsg openError={openErrorResetPass} setOpenError={setOpenErrorResetPass} msg={errorResetPass} />
                            </DialogContent>
                            <DialogActions>
                                <button className="cancel-button" disabled={loadingResetPass} onClick={() => setOpenResetPass(false)}>
                                    Huỷ
                                </button>
                                <button className="password-button" disabled={loadingResetPass} onClick={handleOnClickResetPass}>
                                    Reset
                                </button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div className="register-form">
                        <form onSubmit={handleOnSubmitRegister}>
                            <h1 className="title">Đăng ký</h1>
                            <div className="form-control">
                                <label htmlFor="username">Username</label>
                                <input
                                    className="username"
                                    id="username"
                                    type="text"
                                    placeholder="Tên bạn muốn được gọi"
                                    ref={usernameRef}
                                    required
                                    maxLength="10"
                                />
                            </div>
                            <div className="form-control">
                                <label htmlFor="email-signin">Email</label>
                                <input
                                    className="email-signin"
                                    id="email-signin"
                                    type="email"
                                    placeholder="vd: vibe@gmail.com"
                                    ref={emailRegisterRef}
                                    required
                                />
                                <p className="note">*Thông báo xác nhận sẽ được gửi qua email này</p>
                            </div>
                            <div className="form-control">
                                <label htmlFor="password-signin">Mật khẩu</label>
                                <div className="wrapper-password">
                                    <input
                                        className="password-signin"
                                        id="password-signin"
                                        type={showPasswordRegister ? 'text' : 'password'}
                                        placeholder="Mật khẩu có ít nhất 6 chữ số"
                                        minLength="6"
                                        ref={passRegisterRef}
                                        required
                                    />
                                    <div className="wrapper-icon" onClick={handleOnClickShowPasswordRegister}>
                                        {showPasswordRegister
                                            ? <VisibilityIcon className="icon" />
                                            : <VisibilityOffIcon className="icon" />
                                        }
                                    </div>
                                </div>
                            </div>
                            <SuccessMsg openSuccess={openMsg} setOpenSuccess={setOpenMsg} msg="Một thông báo đã được gửi tới email của bạn, hãy xác nhận nhé" />
                            <ErrorMsg openError={openErrorRegister} setOpenError={setOpenErrorRegister} msg={errorRegister} />
                            <button className={`signin-button ${openErrorRegister || openMsg}`} disabled={loadingRegister}>
                                Đăng ký
                            </button>
                        </form>
                    </div>
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-left">
                                <h2 className="title">Tìm kiếm vibe của bạn</h2>
                                <p>Bạn đã có tài khoản? Đăng nhập vào không gian âm nhạc của bạn tại đây</p>
                                <button onClick={() => setIsRegis(false)}>
                                    Đăng nhập
                                </button>
                            </div>
                            <div className="overlay-right">
                                <h2 className="title">Lướt & phiêu theo vibe của bạn</h2>
                                <p>Bạn chưa có tài khoản? Đăng ký tại đây để trải nghiệm âm nhạc theo cách riêng của bạn</p>
                                <button onClick={() => setIsRegis(true)}>
                                    Đăng ký
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
