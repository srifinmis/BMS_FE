import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../Images/srifin_final.svg";
import "./Login.css";
const Login = () => {
    const [emp_id, setEmpId] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwd, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;
    // console.log('app_url: ', API_URL)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await fetch(`${API_URL}/Login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ emp_id, passwd }),
            });

            const data = await response.json(); // parse only once

            if (response.ok) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("loginSuccess", "true");
                localStorage.setItem("loginTime", Date.now().toString());
                localStorage.setItem("token", data.token);
                navigate("/dashboard");
            } else {
                toast.error(data.message || "Login failed! Please check your credentials.");
            }
        } catch (error) {
            toast.error("Error connecting to the server");
        }
    };

    return (
        <div className="main-div">
            <div className="login-container">
                {/* Left Section */}
                <div className="login-left">
                    <img src={Logo} alt="Logo" className="logo" />
                    <h2>BORROWING MANAGEMENT</h2>
                    <p>Effortlessly manage your loan repayments and track your applications with ease!</p>
                    <h3>Log in to access your account</h3>
                </div>

                {/* Right Section */}
                <div className="login-right">
                    <form onSubmit={handleLogin}>
                        <h2>LOGIN</h2>
                        <TextField
                            type="text"
                            placeholder="User Name"
                            required
                            value={emp_id}
                            onChange={(e) => setEmpId(e.target.value)}
                            sx={{ mb: 2, width: "300px" }}
                            autoComplete="off"
                        />
                        <TextField
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            placeholder="Password"
                            required
                            autoComplete="off"
                            value={passwd}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility} edge="end">
                                            {showPassword ? <VisibilityOff sx={{ color: "#3A78C9" }} /> : <Visibility sx={{ color: "#3A78C9" }} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2, width: "300px" }}
                        />
                        <button type="submit" className="login-btn">LOGIN</button>
                    </form>
                    {message && <p className="message">{message}</p>}

                    <Link to="/ForgotPassword" className="forgot-password">
                        Forgot Password?
                    </Link>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;
