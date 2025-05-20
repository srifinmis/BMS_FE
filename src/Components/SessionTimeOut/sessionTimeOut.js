import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SessionTimeout = () => {
    // const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;
    const SESSION_TIMEOUT = Number(process.env.REACT_APP_TIMEOUT);
    console.log("session Time:", SESSION_TIMEOUT);
    const navigate = useNavigate();
    const location = useLocation();
    const [hasNavigated, setHasNavigated] = useState(false);

    useEffect(() => {
        // Skip session check on login or expired pages
        if (location.pathname === "/" || location.pathname === "/session-expired") return;

        const checkSession = () => {
            const storedTime = parseInt(localStorage.getItem("loginTime"), 10);
            if (storedTime && Date.now() - storedTime > SESSION_TIMEOUT) {
                localStorage.clear();
                if (!hasNavigated) {
                    setHasNavigated(true);
                    navigate("/session-expired", { replace: true });
                }
            }
        };

        const interval = setInterval(checkSession, 5000); // every 5 sec

        return () => clearInterval(interval);
    }, [SESSION_TIMEOUT, location.pathname, navigate, hasNavigated]);

    return null;
};

export default SessionTimeout;