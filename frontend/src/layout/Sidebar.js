import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaThLarge,
    FaStickyNote,
    FaChartBar,
    FaUser,
    FaCog,
    FaUserShield,
    FaChevronLeft,
    FaChevronRight,
    FaBookOpen
} from "react-icons/fa";

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem("role");

    const menuItems = [
        { path: "/dashboard", label: "Dashboard", icon: <FaThLarge /> },
        { path: "/notes", label: "Notes", icon: <FaStickyNote /> },
        { path: "/analytics", label: "Analytics", icon: <FaChartBar /> },
        { path: "/profile", label: "Profile", icon: <FaUser /> },
        { path: "/settings", label: "Settings", icon: <FaCog /> },
    ];

    if (role === "admin") {
        menuItems.push({ path: "/admin", label: "Admin Panel", icon: <FaUserShield /> });
    }

    return (
        <motion.div
            animate={{ width: collapsed ? 80 : 260 }}
            className="h-screen sticky top-0 bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] flex flex-col transition-all duration-300 shadow-2xl z-40"
        >
            {/* Header / Logo */}
            <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
                <AnimatePresence mode="wait">
                    {!collapsed ? (
                        <motion.div
                            key="logo"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/50">
                                <FaBookOpen className="text-white text-lg" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">AI Study</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="collapsed-logo"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/50"
                        >
                            <FaBookOpen className="text-white text-sm" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Menu Items */}
            <div className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <motion.button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group ${isActive
                                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                                    : "hover:bg-slate-800/50 text-slate-400 hover:text-white"
                                }`}
                        >
                            <span className={`text-xl ${isActive ? "text-white" : "group-hover:text-indigo-400"} transition-colors`}>
                                {item.icon}
                            </span>

                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="font-medium whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}

                            {collapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 border border-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-medium z-50">
                                    {item.label}
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Footer / Toggle */}
            <div className="p-4 border-t border-slate-800/50">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
                >
                    {collapsed ? <FaChevronRight /> : <div className="flex items-center gap-3"><FaChevronLeft /> <span className="text-sm font-medium">Collapse</span></div>}
                </button>
            </div>
        </motion.div>
    );
}

export default Sidebar;