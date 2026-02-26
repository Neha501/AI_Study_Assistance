// pages/Register.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API_BASE_URL from "../config/api";
import StarfieldBackground from "../components/StarfieldBackground";
import { FiUser, FiMail, FiLock, FiShield, FiArrowRight, FiCheck } from "react-icons/fi";

const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
};

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        setFormData((prev) => ({ ...prev, [name]: newValue }));
        if (name === "password") setPasswordStrength(getPasswordStrength(value));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Identification required";
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid neural email";
        if (!formData.password || formData.password.length < 6) newErrors.password = "Access key too short";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Keys do not match";
        if (!formData.termsAccepted) newErrors.termsAccepted = "Accept protocols";
        return newErrors;
    };

    const handleRegister = async () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/auth/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            navigate("/");
        } catch (err) {
            setErrors({ general: err.response?.data?.message || "Registration sequence failed." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 overflow-hidden">
            <div className="dark:block hidden">
                <StarfieldBackground starCount={1200} shootingStarRate={0.01} />
            </div>
            <div className="dark:hidden absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />

            <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col lg:flex-row gap-16 items-center">
                {/* Brand Side */}
                <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} className="flex-1 text-center lg:text-left space-y-8">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        <FiShield /> System Initialization
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tighter">
                        Propel your <br />
                        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Cognition.</span>
                    </h1>
                    <p className="text-lg md:text-xl font-medium opacity-60 max-w-lg leading-relaxed">
                        Join the next generation of accelerated learners.
                        Synthesize knowledge at the speed of thought with our AI-powered neural repository.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        <div className="px-6 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[24px] shadow-xl">
                            <div className="text-2xl font-black">98%</div>
                            <div className="text-[10px] items-center uppercase font-black tracking-widest opacity-40">Retention Rate</div>
                        </div>
                        <div className="px-6 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[24px] shadow-xl">
                            <div className="text-2xl font-black">10k+</div>
                            <div className="text-[10px] items-center uppercase font-black tracking-widest opacity-40">Nodes Synced</div>
                        </div>
                    </div>
                </motion.div>

                {/* Form Side */}
                <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
                    <div className="bg-[var(--bg-secondary)] backdrop-blur-2xl border border-[var(--border-color)] p-8 md:p-10 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]">
                        <h2 className="text-2xl font-black mb-8 text-center uppercase tracking-widest">Initialize Node</h2>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-1">Full Identity</label>
                                <div className="relative">
                                    <FiUser className="absolute left-5 top-5 opacity-40" />
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" placeholder="Display Name" />
                                </div>
                                {errors.name && <p className="text-[10px] font-black text-rose-500 px-1 uppercase tracking-widest mt-1">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-1">Neural Email</label>
                                <div className="relative">
                                    <FiMail className="absolute left-5 top-5 opacity-40" />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" placeholder="you@example.com" />
                                </div>
                                {errors.email && <p className="text-[10px] font-black text-rose-500 px-1 uppercase tracking-widest mt-1">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-1">Access Key</label>
                                <div className="relative">
                                    <FiLock className="absolute left-5 top-5 opacity-40" />
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" placeholder="••••••••" />
                                </div>
                                {formData.password && (
                                    <div className="flex gap-1 h-1 mt-2 px-1">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <div key={level} className={`h-full flex-1 rounded-full transition-colors ${level <= passwordStrength ? (passwordStrength <= 2 ? 'bg-rose-500' : passwordStrength <= 3 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-[var(--border-color)] opacity-30'}`} />
                                        ))}
                                    </div>
                                )}
                                {errors.password && <p className="text-[10px] font-black text-rose-500 px-1 uppercase tracking-widest mt-1">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-1">Verify Key</label>
                                <div className="relative">
                                    <FiCheck className="absolute left-5 top-5 opacity-40" />
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" placeholder="••••••••" />
                                </div>
                                {errors.confirmPassword && <p className="text-[10px] font-black text-rose-500 px-1 uppercase tracking-widest mt-1">{errors.confirmPassword}</p>}
                            </div>

                            <div className="flex items-start gap-3 py-4">
                                <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} className="w-5 h-5 rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] text-indigo-600 focus:ring-0 mt-0.5" />
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] select-none cursor-pointer">
                                    I authorize the system protocols and data privacy agreements.
                                </label>
                            </div>
                            {errors.termsAccepted && <p className="text-[10px] font-black text-rose-500 px-1 uppercase tracking-widest -mt-4">{errors.termsAccepted}</p>}

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handleRegister}
                                disabled={loading}
                                className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 mt-6"
                            >
                                {loading ? "Initializing..." : <>Establish Node <FiArrowRight /></>}
                            </motion.button>

                            <p className="text-center text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mt-8">
                                Already initialized?{" "}
                                <Link to="/" className="text-indigo-500 cursor-pointer hover:underline">
                                    Restore Session
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Register;