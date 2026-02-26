// pages/Admin.jsx
import MainLayout from "../layout/MainLayout";
import { motion } from "framer-motion";
import StarfieldBackground from "../components/StarfieldBackground";
import { FiLock, FiShield, FiAlertTriangle, FiUsers, FiTrash2, FiActivity, FiDatabase, FiShieldOff } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

function Admin() {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [usersRes, statsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/admin/users`, { headers: { Authorization: token } }),
                    axios.get(`${API_BASE_URL}/admin/stats`, { headers: { Authorization: token } })
                ]);
                setUsers(usersRes.data);
                setStats(statsRes.data);
            } catch (err) {
                setError(err.response?.data?.message || "Security clearance failed.");
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Permanently deconstruct this user node?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
                headers: { Authorization: token }
            });
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            alert("Deconstruction failed: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return (
        <MainLayout>
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="text-indigo-500 font-black uppercase tracking-widest animate-pulse">Accessing Secure Node...</div>
            </div>
        </MainLayout>
    );

    if (error) return (
        <MainLayout>
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-rose-500 text-6xl mb-4 flex justify-center"><FiShieldOff /></div>
                    <div className="text-rose-500 font-black uppercase tracking-widest">{error}</div>
                </div>
            </div>
        </MainLayout>
    );

    return (
        <MainLayout>
            <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 overflow-hidden">
                <div className="dark:block hidden">
                    <StarfieldBackground starCount={1000} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-12">
                    <div className="flex justify-between items-end">
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter">Admin <span className="text-indigo-600">Mesh</span></h1>
                        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-500 text-[10px] font-black uppercase tracking-widest">
                            <FiShield /> Level 5 Clearance
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: "Total Nodes", value: stats?.totalUsers, icon: FiUsers, color: "text-indigo-500" },
                            { label: "Operators", value: stats?.adminUsers, icon: FiShield, color: "text-purple-500" },
                            { label: "Uptime", value: Math.floor(stats?.uptime / 3600) + "h", icon: FiActivity, color: "text-emerald-500" },
                            { label: "Memory", value: Math.floor(stats?.memoryUsage?.rss / 1024 / 1024) + "MB", icon: FiDatabase, color: "text-amber-500" }
                        ].map((s, i) => (
                            <motion.div key={i} whileHover={{ y: -5 }} className="bg-[var(--bg-secondary)] backdrop-blur-md p-6 rounded-3xl border border-[var(--border-color)] shadow-xl">
                                <div className={`w-10 h-10 ${s.color} bg-current/10 rounded-xl flex items-center justify-center mb-4`}>
                                    <s.icon size={20} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{s.label}</p>
                                <h3 className="text-3xl font-black mt-1 tracking-tighter">{s.value}</h3>
                            </motion.div>
                        ))}
                    </div>

                    {/* User Table */}
                    <div className="bg-[var(--bg-secondary)] backdrop-blur-md rounded-[40px] border border-[var(--border-color)] overflow-hidden shadow-2xl">
                        <div className="px-8 py-6 border-b border-[var(--border-color)] flex justify-between items-center">
                            <h2 className="text-xl font-black uppercase tracking-widest italic">User Directory</h2>
                            <span className="text-[10px] font-black opacity-30">{users.length} TOTAL NODES</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[var(--bg-primary)]/50 text-[10px] font-black uppercase tracking-widest opacity-50">
                                        <th className="px-8 py-4">Identity</th>
                                        <th className="px-8 py-4">Role</th>
                                        <th className="px-8 py-4">Joined</th>
                                        <th className="px-8 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {users.map(user => (
                                        <tr key={user._id} className="hover:bg-[var(--bg-primary)]/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">{user.name}</p>
                                                        <p className="text-[10px] opacity-40 font-bold">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-600/10 text-indigo-500 border border-indigo-500/20' : 'bg-[var(--bg-primary)] border border-[var(--border-color)] opacity-60'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold opacity-40">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="p-3 bg-rose-600/5 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default Admin;
