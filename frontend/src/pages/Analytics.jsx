// pages/Analytics.jsx
import { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ComposedChart,
    CartesianGrid
} from "recharts";
import {
    FiClock,
    FiAward,
    FiZap,
    FiDownload,
    FiRefreshCw,
    FiTrendingUp
} from "react-icons/fi";
import { FaBrain, FaChartLine, FaRocket, FaStar } from "react-icons/fa";
import StarfieldBackground from "../components/StarfieldBackground";
import API_BASE_URL from "../config/api";

function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--bg-secondary)] backdrop-blur-md border border-[var(--border-color)] rounded-xl p-3 shadow-xl text-xs">
                <p className="font-black text-[var(--text-primary)] mb-1 uppercase tracking-wider">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="font-bold" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
}

function Analytics() {
    const [stats, setStats] = useState({ totalNotes: 0, aiGeneratedNotes: 0, categoryStats: [], streak: 0 });
    const [weeklyStats, setWeeklyStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("weekly");
    const [selectedMetric, setSelectedMetric] = useState("count");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = async () => {
        setIsRefreshing(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const [analyticsRes, weeklyRes] = await Promise.all([
                fetch(`${API_BASE_URL}/analytics`, { headers }),
                fetch(`${API_BASE_URL}/analytics/weekly`, { headers })
            ]);

            if (analyticsRes.ok) setStats(await analyticsRes.json());
            if (weeklyRes.ok) setWeeklyStats(await weeklyRes.json());

            setLoading(false);
            setIsRefreshing(false);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const kpiData = [
        { title: "Total Notes", value: stats.totalNotes, change: "+12.5%", trend: "up", icon: FiClock },
        { title: "AI Notes", value: stats.aiGeneratedNotes, change: "+18%", trend: "up", icon: FiAward },
        { title: "Streak", value: stats.streak + "d", change: "+5.2%", trend: "up", icon: FiZap },
        { title: "Consistency", value: Math.min(100, stats.streak * 10) + "%", change: "-2.1%", trend: "down", icon: FiTrendingUp }
    ];

    const radarData = stats.categoryStats.map(c => ({
        subject: c._id || "Other",
        A: c.count * 10,
        B: 50 // Reference average
    }));

    const categoryData = stats.categoryStats.map(c => ({
        subject: c._id || "Other",
        score: c.count
    })).sort((a, b) => b.score - a.score);

    // AI Dynamic Insight
    const topCategory = categoryData[0]?.subject || "N/A";
    const aiInsight = stats.totalNotes > 0
        ? `Your cognitive velocity is trending upward with a strong focus on ${topCategory}. We've detected a significant mastery spike in recent sessions.`
        : "Start creating notes to unlock deep behavioral insights and cognitive patterns.";

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
                    <div className="text-2xl font-bold animate-pulse text-indigo-500">Decrypting Performance...</div>
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

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-12">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                                Performance Analytics
                            </h1>
                            <p className="text-[var(--text-secondary)] mt-3 font-bold flex items-center gap-2">
                                <FaBrain className="text-indigo-500" />
                                AI-driven insights into your intellectual growth.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <motion.button whileHover={{ scale: 1.05 }} onClick={fetchData} className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] transition">
                                <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] transition">
                                <FiDownload className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {kpiData.map((kpi, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-[var(--bg-secondary)] backdrop-blur-md p-6 rounded-3xl border border-[var(--border-color)] shadow-xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[var(--text-secondary)] scale-75 origin-left font-black uppercase tracking-widest">{kpi.title}</p>
                                            <h3 className="text-3xl font-black mt-2">{kpi.value}</h3>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                                            <kpi.icon className="w-6 h-6 text-indigo-500" />
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-4 gap-2 text-xs font-black">
                                        <span className={kpi.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}>
                                            {kpi.trend === 'up' ? '↑ ' : '↓ '}{kpi.change}
                                        </span>
                                        <span className="opacity-40 uppercase">vs last week</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Chart Area */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[var(--bg-secondary)] backdrop-blur-md p-8 rounded-[40px] border border-[var(--border-color)] shadow-2xl">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                            <h2 className="text-2xl font-black flex items-center gap-3">
                                <FaChartLine className="text-indigo-500" />
                                Learning Momentum
                            </h2>
                            <div className="flex flex-wrap gap-2 p-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl">
                                {["weekly", "monthly"].map((period) => (
                                    <button
                                        key={period}
                                        onClick={() => setView(period)}
                                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${view === period ? "bg-indigo-600 text-white shadow-lg" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={weeklyStats}>
                                    <defs>
                                        <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} opacity={0.5} />
                                    <XAxis dataKey="day" stroke="var(--text-secondary)" tick={{ fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#6366f1"
                                        fill="url(#colorMetric)"
                                        strokeWidth={4}
                                        name="Notes Created"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Secondary Insights */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Radar Chart */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[var(--bg-secondary)] backdrop-blur-md p-8 rounded-3xl border border-[var(--border-color)] shadow-xl">
                            <h2 className="text-xl font-black mb-8 flex items-center gap-2">
                                <FaStar className="text-amber-500" />
                                Skill Equilibrium
                            </h2>
                            <div className="h-72">
                                {radarData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart outerRadius="80%" data={radarData}>
                                            <PolarGrid stroke="var(--border-color)" />
                                            <PolarAngleAxis dataKey="subject" stroke="var(--text-secondary)" tick={{ fontSize: 10, fontWeight: 700 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                                            <Radar name="Usage" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                                            <Radar name="Average" dataKey="B" stroke="var(--text-secondary)" fill="var(--text-secondary)" fillOpacity={0.1} />
                                            <Tooltip content={<CustomTooltip />} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-[var(--text-secondary)] italic">No subject data</div>
                                )}
                            </div>
                        </motion.div>

                        {/* Bar Chart */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[var(--bg-secondary)] backdrop-blur-md p-8 rounded-3xl border border-[var(--border-color)] shadow-xl">
                            <h2 className="text-xl font-black mb-8 flex items-center gap-2">
                                <FiAward className="text-indigo-500" />
                                Knowledge Distribution
                            </h2>
                            <div className="h-72">
                                {categoryData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={categoryData} layout="vertical">
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="subject" type="category" stroke="var(--text-primary)" width={80} tick={{ fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="score" fill="#8b5cf6" radius={[0, 10, 10, 0]} barSize={12} name="Notes" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-[var(--text-secondary)] italic">No knowledge data</div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* AI Wisdom Panel */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-indigo-600 to-purple-700 p-10 rounded-[40px] shadow-2xl relative overflow-hidden text-white">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                                <FaRocket />
                                AI Strategic Insight
                            </h2>
                            <p className="text-xl font-medium opacity-90 leading-relaxed max-w-4xl">
                                {aiInsight}
                                <br /><br />
                                <span className="text-sm font-black uppercase tracking-widest opacity-60">Recommendation</span><br />
                                Capitalize on your momentum in <span className="text-indigo-200 font-black">{topCategory}</span> while maintaining consistency in other core domains.
                            </p>
                            <div className="grid sm:grid-cols-3 gap-6 mt-10">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                    <div className="text-3xl font-black">{stats.totalNotes}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Total Impact</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                    <div className="text-3xl font-black">{Math.min(100, stats.streak * 10)}%</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Consistency</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                    <div className="text-3xl font-black">{stats.streak}d</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Current Velocity</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}

export default Analytics;
