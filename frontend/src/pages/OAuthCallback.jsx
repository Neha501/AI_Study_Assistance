// pages/OAuthCallback.jsx
// This page handles the redirect from backend OAuth (Google/GitHub).
// The backend sends: /auth/callback?token=JWT&role=user|admin
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShield } from "react-icons/fi";

function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        const role = searchParams.get("role");
        const error = searchParams.get("error");

        if (error) {
            // Redirect back to login with error
            navigate(`/login?error=${error}`);
            return;
        }

        if (token) {
            localStorage.setItem("token", token);
            if (role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } else {
            navigate("/login?error=no_token");
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 text-center"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
                />
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <FiShield size={20} className="text-indigo-500" />
                    <span className="font-bold text-sm uppercase tracking-widest">
                        Authenticating...
                    </span>
                </div>
            </motion.div>
        </div>
    );
}

export default OAuthCallback;
