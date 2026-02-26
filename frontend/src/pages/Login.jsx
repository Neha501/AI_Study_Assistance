// pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL, BASE_URL } from "../config/api";
import StarfieldBackground from "../components/StarfieldBackground";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import SocialButton from "../components/SocialButton";
import BiometricButton from "../components/BiometricButton";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { FiArrowRight, FiShield } from "react-icons/fi";

const BACKEND_URL = BASE_URL;

function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [socialLoading, setSocialLoading] = useState({ google: false, github: false });

    // Handle error from OAuth redirect (e.g., ?error=google_failed)
    useEffect(() => {
        const oauthError = searchParams.get("error");
        if (oauthError) {
            const messages = {
                google_failed: "Google authentication failed. Please try again.",
                github_failed: "GitHub authentication failed. Please try again.",
                no_token: "Authentication error. No token received."
            };
            setError(messages[oauthError] || "Social login failed.");
        }
    }, [searchParams]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Authentication protocols failed. Check credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        setSocialLoading((prev) => ({ ...prev, [provider]: true }));
        // Redirect to the backend OAuth route — browser will handle the full OAuth flow
        window.location.href = `${BACKEND_URL}/api/auth/${provider}`;
    };


    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 overflow-hidden">
            <div className="dark:block hidden">
                <StarfieldBackground starCount={1200} shootingStarRate={0.01} />
            </div>
            <div className="dark:hidden absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />

            <div className="relative z-10 w-full max-w-lg px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[var(--bg-secondary)] backdrop-blur-2xl border border-[var(--border-color)] p-10 md:p-12 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]"
                >
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-600/30">
                            <FiShield size={32} className="text-white" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-center">Neural Login</h2>
                        <p className="text-[var(--text-secondary)] text-center mt-3 font-bold text-sm uppercase tracking-[0.2em] opacity-60">
                            Access your AI Synthesis Node
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <InputField
                            label="Neural Identity (Email)"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <PasswordField
                            label="Secure Access Key"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] text-indigo-600 focus:ring-0" />
                                <span className="group-hover:text-[var(--text-primary)] transition-colors">Persistent session</span>
                            </label>
                            <button type="button" className="hover:text-indigo-500 transition-colors">Credential recovery</button>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-500 text-center">
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? "Establishing Link..." : <>Authorize Session <FiArrowRight /></>}
                        </motion.button>
                    </form>

                    <div className="flex items-center my-10 gap-4 opacity-20">
                        <div className="flex-1 h-px bg-current"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">or bridge with</span>
                        <div className="flex-1 h-px bg-current"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <SocialButton provider="Google" icon={<FaGoogle />} onClick={() => handleSocialLogin('google')} loading={socialLoading.google} />
                        <SocialButton provider="GitHub" icon={<FaGithub />} onClick={() => handleSocialLogin('github')} loading={socialLoading.github} />
                    </div>

                    <div className="mt-8">
                        <BiometricButton />
                    </div>

                    <p className="text-center text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mt-10">
                        Unauthorized?{" "}
                        <span onClick={() => navigate("/register")} className="text-indigo-500 cursor-pointer hover:underline">
                            Initialize New Node
                        </span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default Login;