// pages/Dashboard.jsx
import MainLayout from "../layout/MainLayout";
import { motion, AnimatePresence, useMotionValue, useTransform, useScroll, useAnimation } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

// Advanced components
import HeatmapCalendar from "../components/HeatmapCalendar";
import StarfieldBackground from "../components/StarfieldBackground";
import API_BASE_URL from "../config/api";

// --- Data ---
const weeklyData = [
    { day: "Mon", hours: 2, target: 3, efficiency: 78 },
    { day: "Tue", hours: 4, target: 3, efficiency: 85 },
    { day: "Wed", hours: 6, target: 4, efficiency: 91 },
    { day: "Thu", hours: 3, target: 4, efficiency: 74 },
    { day: "Fri", hours: 7, target: 5, efficiency: 89 },
    { day: "Sat", hours: 5, target: 4, efficiency: 82 },
    { day: "Sun", hours: 2, target: 2, efficiency: 68 }
];

const subjectData = [
    { name: "DSA", value: 45, color: "#6366f1", trend: "+5%" },
    { name: "OS", value: 30, color: "#8b5cf6", trend: "+2%" },
    { name: "React", value: 60, color: "#ec4899", trend: "+12%" },
    { name: "System Design", value: 25, color: "#14b8a6", trend: "-3%" }
];

const recentNotes = [
    { id: 1, title: "Binary Search Trees", date: "2h ago", emoji: "🌳", category: "DSA" },
    { id: 2, title: "Process Scheduling", date: "5h ago", emoji: "⚙️", category: "OS" },
    { id: 3, title: "React Hooks Deep Dive", date: "Yesterday", emoji: "⚛️", category: "React" },
    { id: 4, title: "Memory Management", date: "Yesterday", emoji: "🧠", category: "OS" }
];

const recommendations = [
    { id: 1, title: "Advanced DSA course", provider: "AlgoExpert", duration: "8h", difficulty: "Hard" },
    { id: 2, title: "Operating Systems: 3 Easy Pieces", provider: "OSTEP", duration: "12h", difficulty: "Medium" },
    { id: 3, title: "React 18 Fundamentals", provider: "FrontendMasters", duration: "6h", difficulty: "Beginner" }
];

const initialNotifications = [
    { id: 1, text: "AI summary generated", time: "5 min ago", read: false, icon: "🤖", type: "info" },
    { id: 2, text: "New recommendation available", time: "1 hour ago", read: false, icon: "📌", type: "success" },
    { id: 3, text: "5-day study streak", time: "Yesterday", read: true, icon: "🔥", type: "achievement" }
];

// --- Helper Components ---

function MagneticButton({ children, className, ...props }) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const x = (clientX - (left + width / 2)) * 0.2;
        const y = (clientY - (top + height / 2)) * 0.2;
        setPosition({ x, y });
    };

    const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={className}
            {...props}
        >
            {children}
        </motion.button>
    );
}

function GlowCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <motion.div
            className="pointer-events-none fixed z-50 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl"
            animate={{ x: mousePosition.x - 128, y: mousePosition.y - 128 }}
            transition={{ type: "tween", ease: "linear", duration: 0.1 }}
        />
    );
}

function AnimatedProgressRing({ percent, label, color, size = 140, strokeWidth = 10 }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <div ref={ref} className="relative flex flex-col items-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border-color)" strokeWidth={strokeWidth} opacity="0.2" />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: isVisible ? circumference * (1 - percent / 100) : circumference }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold" style={{ color }}>{percent}%</span>
            </div>
            <p className="mt-2 text-sm text-[var(--text-secondary)] font-medium">{label}</p>
        </div>
    );
}

function QuickActions({ onFocusMode }) {
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        return scrollY.onChange((latest) => {
            if (latest > 200 && !visible) {
                setVisible(true);
                controls.start({ y: 0, opacity: 1 });
            } else if (latest <= 200 && visible) {
                setVisible(false);
                controls.start({ y: 100, opacity: 0 });
            }
        });
    }, [scrollY, visible, controls]);

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={controls}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2 p-2 bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-2xl"
        >
            <MagneticButton className="px-4 py-2 hover:bg-[var(--bg-primary)] rounded-xl transition text-sm font-bold" onClick={onFocusMode}>
                🎯 Focus
            </MagneticButton>
            <MagneticButton className="px-4 py-2 hover:bg-[var(--bg-primary)] rounded-xl transition text-sm font-bold">
                📊 Analytics
            </MagneticButton>
            <MagneticButton className="px-4 py-2 hover:bg-[var(--bg-primary)] rounded-xl transition text-sm font-bold">
                📝 Notes
            </MagneticButton>
        </motion.div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--bg-secondary)] backdrop-blur-md border border-[var(--border-color)] rounded-xl p-3 shadow-xl">
                <p className="text-sm font-bold text-[var(--text-primary)] mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-xs font-medium" style={{ color: entry.color }}>
                        {entry.name}: {entry.value} hours
                    </p>
                ))}
            </div>
        );
    }
    return null;
}

function useContextMenu(items) {
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null });

    const handleContextMenu = (e, item) => {
        e.preventDefault();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, item });
    };

    const closeContextMenu = () => setContextMenu({ ...contextMenu, visible: false });

    useEffect(() => {
        const handleClick = () => closeContextMenu();
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    const ContextMenuComponent = () => (
        <AnimatePresence>
            {contextMenu.visible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{ position: "fixed", top: contextMenu.y, left: contextMenu.x, zIndex: 100 }}
                    className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl p-1 min-w-[160px] backdrop-blur-md"
                >
                    {items.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => { item.action(contextMenu.item); closeContextMenu(); }}
                            className="w-full text-left px-3 py-2 hover:bg-[var(--bg-primary)] rounded-lg text-sm transition font-medium"
                        >
                            {item.label}
                        </button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );

    return { handleContextMenu, ContextMenuComponent };
}

function useRealtimeData(initialData) {
    const [data, setData] = useState(initialData);
    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => ({
                ...prev,
                studyHours: prev.studyHours + (Math.random() * 0.1),
                aiNotes: prev.aiNotes + (Math.random() > 0.9 ? 1 : 0),
                streak: prev.streak
            }));
        }, 10000);
        return () => clearInterval(interval);
    }, []);
    return data;
}

function FlipTime({ time }) {
    return (
        <div className="text-3xl font-mono font-bold text-indigo-500">
            {time}
        </div>
    );
}

// Sub-components for cleaner Dashboard
const GlassCard = ({ title, children, className = "" }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`bg-[var(--bg-secondary)] backdrop-blur-md p-6 rounded-2xl border border-[var(--border-color)] shadow-xl ${className}`}
    >
        {title && <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">{title}</h2>}
        {children}
    </motion.div>
);

const TiltCard = ({ children }) => {
    const ref = useRef(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        setRotateX(((e.clientY - rect.top - centerY) / centerY) * -10);
        setRotateY(((e.clientX - rect.left - centerX) / centerX) * 10);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
            style={{ rotateX, rotateY, transformPerspective: 1000 }}
            className="bg-[var(--bg-secondary)] backdrop-blur-md border border-[var(--border-color)] p-6 rounded-2xl shadow-xl transition-shadow hover:shadow-2xl"
        >
            {children}
        </motion.div>
    );
};

const StatCardContent = ({ title, value, icon, trend, trendUp }) => (
    <>
        <div className="flex justify-between items-start">
            <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider">{title}</p>
            <span className="text-2xl">{icon}</span>
        </div>
        <h3 className="text-3xl font-black mt-2 text-[var(--text-primary)]">{value}</h3>
        <p className={`text-xs mt-2 font-bold ${trendUp ? "text-emerald-500" : "text-rose-500"}`}>
            {trend}
        </p>
    </>
);

// --- Main Dashboard ---
export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [stats, setStats] = useState({ totalNotes: 0, aiGeneratedNotes: 0, categoryStats: [], streak: 0 });
    const [weeklyStats, setWeeklyStats] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [timer, setTimer] = useState(25 * 60);
    const [timerActive, setTimerActive] = useState(false);
    const [typedDate, setTypedDate] = useState("");
    const [focusMode, setFocusMode] = useState(false);

    // Realtime stats now starting with 0 and merging with backend data
    const [realtimeSessionHours, setRealtimeSessionHours] = useState(0);

    const { handleContextMenu: handleNoteContextMenu, ContextMenuComponent: NoteContextMenu } = useContextMenu([
        { label: "View Note", action: (n) => console.log(n) },
        { label: "Delete", action: (n) => console.log("delete", n) }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch User Profile
                const profileRes = await fetch(`${API_BASE_URL}/user/profile`, { headers });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setUserData(profileData);
                }

                // Fetch Analytics
                const analyticsRes = await fetch(`${API_BASE_URL}/analytics`, { headers });
                if (analyticsRes.ok) {
                    const analyticsData = await analyticsRes.json();
                    setStats(analyticsData);
                }

                // Fetch Weekly Stats
                const weeklyRes = await fetch(`${API_BASE_URL}/analytics/weekly`, { headers });
                if (weeklyRes.ok) {
                    const weeklyData = await weeklyRes.json();
                    setWeeklyStats(weeklyData);
                }

                // Fetch Recent Notes
                const notesRes = await fetch(`${API_BASE_URL}/study?limit=4&sort=latest`, { headers });
                if (notesRes.ok) {
                    const notesData = await notesRes.json();
                    setNotes(notesData);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setLoading(false);
            }
        };

        fetchData();

        const fullDate = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
        let i = 0;
        const interval = setInterval(() => {
            setTypedDate(fullDate.slice(0, i));
            if (++i > fullDate.length) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let interval;
        if (timerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer(t => t - 1);
                setRealtimeSessionHours(prev => prev + (1 / 3600)); // Increment session hours
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerActive, timer]);

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

    // Estimated total study hours based on notes (e.g., 2 hours per note) + current session
    const estimatedTotalHours = (stats.totalNotes * 2) + realtimeSessionHours;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    /* ... rest of variants and helpers ... */
    // Transform stats for charts
    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b"];
    const subjectData = (stats.categoryStats || []).map((item, index) => ({
        name: item._id || "Uncategorized",
        value: item.count,
        color: colors[index % colors.length]
    }));

    const getEmojiForCategory = (cat) => {
        const emojis = {
            "DSA": "🌳",
            "OS": "⚙️",
            "React": "⚛️",
            "System Design": "🏗️",
            "Database": "🗄️",
            "General": "📝"
        };
        return emojis[cat] || "📝";
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
                    <div className="text-2xl font-bold animate-pulse text-indigo-500">Loading Intelligence...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500">
                <div className="dark:block hidden">
                    <StarfieldBackground starCount={1000} shootingStarRate={0.02} />
                </div>
                <div className="dark:hidden absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50" />

                <GlowCursor />
                <QuickActions onFocusMode={() => setFocusMode(!focusMode)} />
                <NoteContextMenu />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black premium-gradient-text">
                                Welcome back, {userData?.name || "Scholar"}
                            </h1>
                            <p className="text-[var(--text-secondary)] mt-2 font-bold flex items-center gap-2">
                                <span>📅</span> {typedDate}
                                <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity }} className="w-1 h-5 bg-cyan-500" />
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href = '/pricing'}
                            className="premium-button flex items-center gap-2 px-8 py-4"
                        >
                            <span className="text-xl">👑</span> Upgrade to Pro
                        </motion.button>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {!focusMode ? (
                            <motion.div key="dashboard" initial="hidden" animate="visible" exit={{ opacity: 0, y: 20 }} variants={containerVariants}>
                                {/* KPI Section */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                    <TiltCard><StatCardContent title="Total Notes" value={stats.totalNotes} icon="📝" trend="+3 this week" trendUp /></TiltCard>
                                    <TiltCard><StatCardContent title="AI Generated" value={stats.aiGeneratedNotes} icon="🤖" trend={`${Math.round((stats.aiGeneratedNotes / (stats.totalNotes || 1)) * 100)}% of total`} trendUp /></TiltCard>
                                    <TiltCard><StatCardContent title="Study Hours" value={Math.floor(estimatedTotalHours) + "h"} icon="⏱️" trend="+12% total" trendUp /></TiltCard>
                                    <TiltCard><StatCardContent title="Streak" value={stats.streak + " Days"} icon="🔥" trend="Best: 12" trendUp /></TiltCard>
                                </div>

                                {/* Charts & Analytics */}
                                <div className="grid lg:grid-cols-3 gap-8 mb-10">
                                    <GlassCard title="Learning Momentum" className="lg:col-span-2">
                                        <div className="h-72 mt-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={weeklyStats}>
                                                    <defs>
                                                        <linearGradient id="momentumGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis dataKey="day" stroke="var(--text-secondary)" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                                    <YAxis hide />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Area type="monotone" dataKey="count" name="Notes" stroke="#6366f1" strokeWidth={4} fill="url(#momentumGrad)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </GlassCard>

                                    <GlassCard title="Subject Mix">
                                        <div className="h-64">
                                            {subjectData.length > 0 ? (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie data={subjectData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                            {subjectData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                                        </Pie>
                                                        <Tooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-[var(--text-secondary)] text-sm italic">
                                                    No subjects yet
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            {subjectData.map(s => (
                                                <div key={s.name} className="text-[10px] font-bold flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                                                    <span className="text-[var(--text-primary)]">{s.name} ({s.value})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </GlassCard>
                                </div>

                                {/* Progress Rings */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                    <AnimatedProgressRing percent={Math.min(100, (stats.totalNotes * 5))} label="Overall Progress" color="#6366f1" />
                                    <AnimatedProgressRing percent={Math.min(100, (stats.aiGeneratedNotes * 10))} label="AI Adoption" color="#8b5cf6" />
                                    <AnimatedProgressRing percent={Math.min(100, (stats.streak * 20))} label="Consistency" color="#ec4899" />
                                </div>

                                {/* Bottom Row */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <GlassCard title="Recent Notes">
                                        <div className="space-y-3">
                                            {notes.length > 0 ? notes.map(n => (
                                                <motion.div key={n._id} whileHover={{ x: 5 }} onContextMenu={(e) => handleNoteContextMenu(e, n)} className="flex items-center justify-between p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl cursor-context-menu">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl">{getEmojiForCategory(n.category)}</span>
                                                        <div>
                                                            <p className="font-bold text-sm">{n.title}</p>
                                                            <p className="text-[10px] text-[var(--text-secondary)]">{new Date(n.createdAt).toLocaleDateString()} • {n.category}</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-indigo-500 font-bold text-xs hover:underline">View</button>
                                                </motion.div>
                                            )) : (
                                                <div className="text-center py-4 text-[var(--text-secondary)] italic text-sm">No notes found</div>
                                            )}
                                        </div>
                                    </GlassCard>

                                    <GlassCard title="Quick Focus">
                                        <div className="flex flex-col items-center justify-center h-full py-4">
                                            <p className="text-sm text-[var(--text-secondary)] font-bold mb-2">Current Session</p>
                                            <FlipTime time={formatTime(timer)} />
                                            <div className="flex gap-3 mt-6">
                                                <MagneticButton onClick={() => setTimerActive(!timerActive)} className={`px-8 py-2 rounded-xl text-white font-bold transition ${timerActive ? 'bg-rose-500' : 'bg-indigo-600'}`}>
                                                    {timerActive ? 'Pause' : 'Start'}
                                                </MagneticButton>
                                                <MagneticButton onClick={() => setTimer(25 * 60)} className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl font-bold text-xs">
                                                    Reset
                                                </MagneticButton>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </div>
                                <div className="mt-10">
                                    <HeatmapCalendar />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="focus" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                                <motion.div animate={{ scale: timerActive ? [1, 1.05, 1] : 1 }} transition={{ repeat: Infinity, duration: 2 }} className="mb-12">
                                    <h2 className="text-6xl md:text-8xl font-black mb-4">Focus Mode</h2>
                                    <div className="text-[120px] md:text-[180px] font-mono font-black text-indigo-500 leading-none">
                                        {formatTime(timer)}
                                    </div>
                                </motion.div>
                                <div className="flex gap-4">
                                    <MagneticButton onClick={() => setTimerActive(!timerActive)} className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-2xl shadow-xl shadow-indigo-500/20">
                                        {timerActive ? "Pause Session" : "Start Focus"}
                                    </MagneticButton>
                                    <MagneticButton onClick={() => setFocusMode(false)} className="px-12 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl font-black text-2xl">
                                        End Session
                                    </MagneticButton>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </MainLayout>
    );
}
