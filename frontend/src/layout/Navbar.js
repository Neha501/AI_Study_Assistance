import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Navbar({ user }) {
    const navigate = useNavigate();
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
    const userName = user?.name || "User";
    const userPlan = user?.subscription?.plan ? `${user.subscription.plan} Plan` : "Free Tier";

    return (
        <div className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] px-4 md:px-8 py-4 flex justify-between items-center relative transition-colors duration-300">

            {/* Left Section */}
            <div className="flex items-center gap-4 md:gap-6">
                <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent cursor-pointer" onClick={() => navigate("/dashboard")}>
                    AI Study Assistant
                </h1>

                {/* Search Bar - improved with icon and better styles */}
                <div className="hidden md:flex items-center bg-[var(--bg-secondary)] px-4 py-2 rounded-xl border border-[var(--border-color)] focus-within:ring-2 focus-within:ring-indigo-500/50 transition">
                    <span className="text-slate-400 mr-2">🔍</span>
                    <input
                        type="text"
                        placeholder="Search notes..."
                        className="bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder-slate-400 w-48 lg:w-64"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 md:gap-6">

                {/* Dark Mode Toggle - Enhanced with better UI */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-lg hover:shadow-lg transition-all"
                >
                    {darkMode ? "🌙" : "☀️"}
                </motion.button>

                {/* Notification Bell */}
                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="relative p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:shadow-lg transition-all"
                    >
                        <span>🔔</span>
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--bg-primary)]"></span>
                    </motion.button>

                    <AnimatePresence>
                        {notifOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 mt-4 w-72 md:w-80 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-4 shadow-2xl z-50 backdrop-blur-xl bg-opacity-90 dark:bg-opacity-90"
                            >
                                <div className="flex justify-between items-center mb-4 border-b border-[var(--border-color)] pb-2">
                                    <h3 className="font-bold text-[var(--text-primary)]">Notifications</h3>
                                    <button className="text-xs text-indigo-500 hover:text-indigo-400">Mark all as read</button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition">
                                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">🤖</div>
                                        <div>
                                            <p className="text-sm font-medium text-[var(--text-primary)]">AI summary generated</p>
                                            <p className="text-xs text-[var(--text-secondary)]">2 minutes ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition">
                                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">🔥</div>
                                        <div>
                                            <p className="text-sm font-medium text-[var(--text-primary)]">5-day study streak!</p>
                                            <p className="text-xs text-[var(--text-secondary)]">1 hour ago</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 p-1 md:p-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] transition-all"
                    >
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                            {userInitial}
                        </div>
                    </motion.button>

                    <AnimatePresence>
                        {profileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 mt-4 w-56 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-xl bg-opacity-90"
                            >
                                <div className="px-3 py-2 border-b border-[var(--border-color)] mb-2">
                                    <p className="text-sm font-bold text-[var(--text-primary)]">{userName}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">{userPlan}</p>
                                </div>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => { navigate("/profile"); setProfileOpen(false); }}
                                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-xl transition text-left"
                                    >
                                        <span>👤</span> Profile
                                    </button>
                                    <button
                                        onClick={() => { navigate("/settings"); setProfileOpen(false); }}
                                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-xl transition text-left"
                                    >
                                        <span>⚙️</span> Settings
                                    </button>
                                    <button
                                        onClick={() => {
                                            localStorage.clear();
                                            window.location.href = "/";
                                        }}
                                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition text-left"
                                    >
                                        <span>🚪</span> Logout
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}

export default Navbar;
