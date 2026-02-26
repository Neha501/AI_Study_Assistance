// pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { FiEdit2, FiCamera, FiAward, FiClock, FiTrendingUp, FiShield, FiMapPin, FiChevronRight } from 'react-icons/fi';
import { FaMedal, FaStar, FaRocket } from 'react-icons/fa';
import { motion } from "framer-motion";
import StarfieldBackground from "../components/StarfieldBackground";
import axios from "axios";
import API_BASE_URL from "../config/api";

function Profile() {
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API_BASE_URL}/user/profile`, {
                    headers: { Authorization: token }
                });
                setUser(res.data);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const stats = [
        { title: "Total Notes", value: "142", icon: FiTrendingUp, color: "var(--accent-primary)" },
        { title: "AI Units", value: "85", icon: FiAward, color: "#8b5cf6" },
        { title: "Study Hours", value: "312h", icon: FiClock, color: "#10b981" }
    ];

    const activities = [
        { action: "Synthesized 'Quantum Mechanics' notes", time: "2 hours ago", icon: FiEdit2 },
        { action: "Achieved Neural Sync level 5", time: "Yesterday", icon: FiAward },
        { action: "Unlocked 'Deep Diver' badge", time: "3 days ago", icon: FiTrendingUp }
    ];

    const badges = [
        { name: "Note Master", icon: FaMedal, color: "text-amber-400" },
        { name: "AI Explorer", icon: FaRocket, color: "text-blue-400" },
        { name: "Streak Saver", icon: FaStar, color: "text-purple-400" }
    ];

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                    <div className="text-indigo-500 font-black uppercase tracking-widest animate-pulse">Establishing Neural Link...</div>
                </div>
            </MainLayout>
        );
    }

    if (!user) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                    <div className="text-rose-500 font-black uppercase tracking-widest">Neural Link Severed. Please Login.</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 overflow-hidden">
                <div className="dark:block hidden">
                    <StarfieldBackground starCount={1000} />
                </div>
                <div className="dark:hidden absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 space-y-12">
                    {/* Premium Profile Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-[var(--bg-secondary)] backdrop-blur-md rounded-[40px] border border-[var(--border-color)] overflow-hidden shadow-2xl">
                        <div className="h-40 bg-gradient-to-r from-indigo-600 to-purple-800 opacity-20" />
                        <div className="px-8 pb-8 -mt-16">
                            <div className="flex flex-col md:flex-row items-end md:items-center gap-8">
                                <div className="relative group">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] border-4 border-[var(--bg-primary)] bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-6xl font-black text-white shadow-2xl">
                                        {user.name.charAt(0)}
                                    </div>
                                    <motion.button whileHover={{ scale: 1.1 }} className="absolute bottom-2 right-2 bg-indigo-600 p-3 rounded-2xl border-2 border-[var(--bg-primary)] text-white shadow-xl">
                                        <FiCamera className="w-5 h-5" />
                                    </motion.button>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <h2 className="text-4xl font-black tracking-tight">{user.name}</h2>
                                        <span className="px-3 py-1 bg-indigo-600/10 border border-indigo-500/30 text-indigo-500 text-[10px] font-black uppercase tracking-widest rounded-lg">PRO MEMBER</span>
                                    </div>
                                    <p className="text-indigo-500 font-bold mt-1 text-lg italic">"{user.role}"</p>
                                    <div className="flex gap-4 mt-4 text-[var(--text-secondary)] font-bold text-sm">
                                        <span className="flex items-center gap-1"><FiMapPin /> {user.location || "Earth"}</span>
                                        <span className="opacity-40">|</span>
                                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => navigate("/settings")}
                                    className="px-6 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-lg flex items-center gap-2"
                                >
                                    Modify Identity <FiChevronRight />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-[var(--bg-secondary)] backdrop-blur-md p-6 rounded-3xl border border-[var(--border-color)] shadow-xl flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest">{stat.title}</p>
                                    <h3 className="text-3xl font-black mt-1 tracking-tighter">{stat.value}</h3>
                                </div>
                                <div className="w-12 h-12 flex items-center justify-center bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)]" style={{ color: stat.color }}>
                                    <stat.icon size={24} />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Achievements */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[var(--bg-secondary)] backdrop-blur-md p-8 rounded-3xl border border-[var(--border-color)] shadow-xl">
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3 italic uppercase tracking-widest">
                                <FaMedal className="text-amber-500" />
                                Cognitive Milestones
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                {badges.map((badge, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-3 group">
                                        <div className={`p-5 rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-inner ${badge.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <badge.icon size={32} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-center opacity-70">{badge.name}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[var(--bg-secondary)] backdrop-blur-md p-8 rounded-3xl border border-[var(--border-color)] shadow-xl">
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3 italic uppercase tracking-widest">
                                <FiClock className="text-indigo-500" />
                                Activity Feed
                            </h3>
                            <div className="space-y-4">
                                {activities.map((activity, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-[var(--bg-primary)] rounded-2xl border border-transparent hover:border-[var(--border-color)] transition-all group">
                                        <div className="w-10 h-10 flex items-center justify-center bg-indigo-600/10 text-indigo-500 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <activity.icon size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm tracking-tight">{activity.action}</p>
                                            <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest mt-1 opacity-50">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Bio Section */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[var(--bg-secondary)] backdrop-blur-md p-8 rounded-3xl border border-[var(--border-color)] shadow-xl">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3 italic uppercase tracking-widest">
                            <FiAward className="text-purple-500" />
                            Professional Summary
                        </h3>
                        <p className="text-lg font-medium opacity-80 leading-relaxed italic border-l-4 border-indigo-600 pl-6">
                            "{user.bio}"
                        </p>
                    </motion.div>

                    {/* Security Quick Link */}
                    <div className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-white group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-14 h-14 flex items-center justify-center bg-white/10 rounded-2xl border border-white/20">
                                <FiShield size={28} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black uppercase tracking-widest">Digital Fortress</h4>
                                <p className="opacity-70 text-sm font-bold">Manage your security protocols and authentication.</p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => navigate("/settings")}
                            className="px-8 py-3 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl relative z-10 active:scale-95 transition-all"
                        >
                            Security Settings
                        </motion.button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default Profile;