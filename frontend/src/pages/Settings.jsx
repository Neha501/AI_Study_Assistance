// pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import MainLayout from "../layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiUser, FiShield, FiBell, FiCode, FiCreditCard, FiSettings,
    FiCheck, FiChevronRight, FiCommand, FiZap, FiCpu, FiGlobe, FiMoon, FiShieldOff,
    FiPlus, FiCopy, FiTrash2, FiExternalLink, FiArchive, FiDatabase
} from "react-icons/fi";
import StarfieldBackground from "../components/StarfieldBackground";
import axios from "axios";
import API_BASE_URL from "../config/api";

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [twoFA, setTwoFA] = useState(true);
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(true);
    const [aiFeatures, setAiFeatures] = useState(true);
    const [debugMode, setDebugMode] = useState(false);

    const [user, setUser] = useState({
        name: "",
        email: "",
        specialization: "",
        timezone: "UTC",
        bio: "",
        location: "",
        phone: "",
        twoFactorEnabled: false,
        emailNotifications: true,
        pushNotifications: true,
        aiFeaturesEnabled: true,
        debugModeEnabled: false,
        subscription: null
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API_BASE_URL}/user/profile`, {
                    headers: { Authorization: token }
                });
                setUser(prev => ({ ...prev, ...res.data }));
            } catch (err) {
                console.error("Failed to fetch settings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSync = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_BASE_URL}/user/profile`, user, {
                headers: { Authorization: token }
            });
            setMessage({ type: "success", text: "Neural configuration synced successfully." });
        } catch (err) {
            setMessage({ type: "error", text: "Sync failed. Error in data transmission." });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateSettings = async (updates) => {
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(`${API_BASE_URL}/user/settings`, updates, {
                headers: { Authorization: token }
            });
            setUser(prev => ({ ...prev, ...res.data }));
        } catch (err) {
            console.error("Failed to update settings:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match" });
            return;
        }
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_BASE_URL}/user/update-password`, {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            }, {
                headers: { Authorization: token }
            });
            setMessage({ type: "success", text: "Password updated successfully" });
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Password update failed" });
        } finally {
            setSaving(false);
        }
    };

    const [apiKeys, setApiKeys] = useState([
        { id: 1, key: "sk_live_•••••••••••••••a4f1q", type: "Live" },
        { id: 2, key: "sk_test_•••••••••••••••f8j3s", type: "Test" }
    ]);

    const Toggle = ({ checked, onChange }) => (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <div className="relative w-12 h-6 bg-[var(--bg-primary)] border border-[var(--border-color)] peer-checked:bg-indigo-600 rounded-full peer after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6 shadow-sm shadow-indigo-500/20"></div>
        </label>
    );

    const tabs = [
        { id: 'profile', icon: FiUser, label: 'Profile' },
        { id: 'security', icon: FiShield, label: 'Security' },
        { id: 'notifications', icon: FiBell, label: 'Alerts' },
        { id: 'api', icon: FiCode, label: 'Developer' },
        { id: 'billing', icon: FiCreditCard, label: 'Subscription' },
        { id: 'advanced', icon: FiCpu, label: 'System' },
    ];

    const handleCopy = (key) => {
        navigator.clipboard.writeText(key);
        // Add toast notification logic here if needed
    };

    return (
        <MainLayout>
            <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 overflow-hidden">
                <div className="dark:block hidden">
                    <StarfieldBackground starCount={1000} />
                </div>
                <div className="dark:hidden absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                    {/* Header */}
                    <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-4">
                                <FiSettings size={40} className="text-indigo-600" />
                                Core Configuration
                            </h1>
                            <p className="text-[var(--text-secondary)] mt-3 font-bold uppercase tracking-widest text-xs opacity-60">System Preferences & Preference Nodes</p>
                        </div>
                        <div className="px-6 py-3 bg-[var(--bg-secondary)] backdrop-blur-md rounded-2xl border border-[var(--border-color)] shadow-xl flex items-center gap-3">
                            <FiMoon className="text-indigo-500" />
                            <span className="text-xs font-black uppercase tracking-widest">Adaptive Dark Mode active</span>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Sidebar */}
                        <aside className="lg:w-72 flex-shrink-0">
                            <div className="bg-[var(--bg-secondary)] backdrop-blur-md rounded-[32px] border border-[var(--border-color)] overflow-hidden shadow-2xl p-3">
                                <nav className="space-y-2">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 font-black text-xs uppercase tracking-widest ${activeTab === tab.id
                                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <tab.icon size={18} />
                                                <span>{tab.label}</span>
                                            </div>
                                            {activeTab === tab.id && <FiChevronRight />}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-[32px] border border-indigo-500/20 shadow-xl">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 flex items-center gap-2">
                                    <FiZap /> System Pro-Tip
                                </h4>
                                <p className="text-xs font-bold leading-relaxed opacity-70">
                                    Use 'Cmd + S' across the platform to quickly sync knowledge nodes to your AI repository.
                                </p>
                            </div>
                        </aside>

                        {/* Content Area */}
                        <main className="flex-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-[var(--bg-secondary)] backdrop-blur-md rounded-[40px] border border-[var(--border-color)] p-8 md:p-12 shadow-2xl min-h-[600px]"
                                >
                                    {/* Profile Tab */}
                                    {activeTab === 'profile' && (
                                        <div className="space-y-10">
                                            <div className="flex items-center gap-8">
                                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <button className="px-6 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition shadow-lg">
                                                        Update Avatar
                                                    </button>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mt-2 opacity-50">HEIC, PNG or JPG max 4MB</p>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-1">Display Name</label>
                                                    <input
                                                        type="text"
                                                        value={user.name}
                                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-6 py-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-inner"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-1">Identity Vector (Email)</label>
                                                    <input
                                                        type="email"
                                                        value={user.email}
                                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-6 py-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-inner"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-1">Specialization</label>
                                                    <input
                                                        type="text"
                                                        value={user.specialization}
                                                        onChange={(e) => setUser({ ...user, specialization: e.target.value })}
                                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-6 py-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-inner"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-1">Timezone / Sync</label>
                                                    <select
                                                        value={user.timezone}
                                                        onChange={(e) => setUser({ ...user, timezone: e.target.value })}
                                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-6 py-4 font-bold text-sm appearance-none outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-inner"
                                                    >
                                                        <option>Pacific Standard (PST)</option>
                                                        <option>Eastern Standard (EST)</option>
                                                        <option>Central European (CET)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {message.text && (
                                                <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'}`}>
                                                    {message.text}
                                                </div>
                                            )}

                                            <div className="pt-6">
                                                <button
                                                    onClick={handleSync}
                                                    disabled={saving}
                                                    className="px-10 py-4 bg-indigo-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30 active:scale-95 transition-transform disabled:opacity-50"
                                                >
                                                    {saving ? "Syncing..." : "Sync Profile Changes"}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Security Tab */}
                                    {activeTab === 'security' && (
                                        <div className="space-y-8">
                                            <div className="p-8 bg-[var(--bg-primary)] rounded-[32px] border border-[var(--border-color)]">
                                                <h3 className="text-sm font-black uppercase tracking-widest mb-6">Update Credentials</h3>
                                                <form onSubmit={handleUpdatePassword} className="space-y-4">
                                                    <div className="grid md:grid-cols-3 gap-4">
                                                        <input
                                                            type="password"
                                                            placeholder="Current Password"
                                                            value={passwords.currentPassword}
                                                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                                            required
                                                        />
                                                        <input
                                                            type="password"
                                                            placeholder="New Password"
                                                            value={passwords.newPassword}
                                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                                            required
                                                        />
                                                        <input
                                                            type="password"
                                                            placeholder="Confirm New Password"
                                                            value={passwords.confirmPassword}
                                                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                                            required
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={saving}
                                                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
                                                    >
                                                        {saving ? "Updating..." : "Update Master Password"}
                                                    </button>
                                                </form>
                                            </div>

                                            <div className="p-10 bg-indigo-600/5 rounded-[40px] border border-indigo-500/20">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <FiShield className="text-indigo-600" size={24} />
                                                            <h3 className="text-lg font-black uppercase tracking-widest">Two-Factor Protocol</h3>
                                                        </div>
                                                        <p className="text-sm font-bold text-[var(--text-secondary)] mt-3 max-w-md">Multi-layered security using hardware keys or biometric authenticator apps.</p>
                                                    </div>
                                                    <Toggle checked={user.twoFactorEnabled} onChange={(val) => handleUpdateSettings({ twoFactorEnabled: val })} />
                                                </div>
                                                {user.twoFactorEnabled && (
                                                    <div className="mt-8 flex gap-4">
                                                        <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">Configure TOTP</button>
                                                        <button className="px-6 py-3 bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest">Emergency Recovery</button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-8 bg-[var(--bg-primary)] rounded-[32px] border border-[var(--border-color)]">
                                                <h3 className="text-sm font-black uppercase tracking-widest mb-4">Device Sessions</h3>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
                                                        <div className="flex items-center gap-4">
                                                            <FiGlobe className="text-indigo-500" />
                                                            <div>
                                                                <p className="text-xs font-black uppercase tracking-widest">Chrome on MacOS</p>
                                                                <p className="text-[10px] font-bold opacity-50">Current Session · SF, USA</p>
                                                            </div>
                                                        </div>
                                                        <span className="px-3 py-1 bg-indigo-600/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest rounded-lg">Active</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Notifications Tab */}
                                    {activeTab === 'notifications' && (
                                        <div className="space-y-6">
                                            {[
                                                { label: "Neural Update Alerts", desc: "Weekly AI intelligence reports and synthesis summaries.", state: user.emailNotifications, field: 'emailNotifications' },
                                                { label: "Push Propagation", desc: "Direct system alerts for critical study milestones.", state: user.pushNotifications, field: 'pushNotifications' },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-8 bg-[var(--bg-primary)] rounded-[32px] border border-[var(--border-color)]">
                                                    <div>
                                                        <h3 className="text-sm font-black uppercase tracking-widest">{item.label}</h3>
                                                        <p className="text-[10px] font-bold text-[var(--text-secondary)] mt-1 opacity-60 max-w-sm">{item.desc}</p>
                                                    </div>
                                                    <Toggle checked={item.state} onChange={(val) => handleUpdateSettings({ [item.field]: val })} />
                                                </div>
                                            ))}
                                            <div className="pt-6">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-6 px-1">Specific Signal Filters</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {['System Health', 'API Usage', 'Note Sync', 'Collab Requests'].map(tag => (
                                                        <div key={tag} className="flex items-center gap-4 px-6 py-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl">
                                                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded-[6px] text-indigo-600 focus:ring-0 transition shadow-sm bg-transparent border-[var(--border-color)]" />
                                                            <span className="text-xs font-black uppercase tracking-widest opacity-80">{tag}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* API Tab */}
                                    {activeTab === 'api' && (
                                        <div className="space-y-10">
                                            <div className="flex justify-between items-center mb-6">
                                                <div>
                                                    <h3 className="text-xl font-black uppercase tracking-widest">Developer Access</h3>
                                                    <p className="text-sm font-bold text-[var(--text-secondary)] mt-1 opacity-60">Manage your neural interface API keys.</p>
                                                </div>
                                                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">
                                                    <FiPlus /> Generate New Key
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                {apiKeys.map(key => (
                                                    <div key={key.id} className="p-6 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[32px] flex justify-between items-center">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500">
                                                                <FiCommand />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black uppercase tracking-widest">{key.type} Node Access</p>
                                                                <code className="text-xs opacity-60 font-mono mt-1 block">{key.key}</code>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleCopy(key.key)} className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl hover:text-indigo-500 transition shadow-sm"><FiCopy /></button>
                                                            <button className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl hover:text-rose-500 transition shadow-sm"><FiTrash2 /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="pt-8">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-6">Documentation Hub</h4>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <button className="flex items-center justify-between p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl hover:border-indigo-500/30 transition group">
                                                        <div className="flex items-center gap-4">
                                                            <FiExternalLink className="text-indigo-500" />
                                                            <span className="text-xs font-black uppercase tracking-widest">API Reference</span>
                                                        </div>
                                                        <FiChevronRight className="opacity-0 group-hover:opacity-100 transition" />
                                                    </button>
                                                    <button className="flex items-center justify-between p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl hover:border-indigo-500/30 transition group">
                                                        <div className="flex items-center gap-4">
                                                            <FiExternalLink className="text-indigo-500" />
                                                            <span className="text-xs font-black uppercase tracking-widest">Dev Sandbox</span>
                                                        </div>
                                                        <FiChevronRight className="opacity-0 group-hover:opacity-100 transition" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Billing Tab */}
                                    {activeTab === 'billing' && (
                                        <div className="space-y-10">
                                            <div className="p-10 bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[40px] shadow-2xl relative overflow-hidden text-white">
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <span className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest">Current Plan</span>
                                                            <h3 className="text-4xl font-black mt-4">{user.subscription?.plan || "Free"} Plan</h3>
                                                            <p className="text-sm font-bold opacity-80 mt-2">
                                                                {user.subscription?.plan === 'Free' ? 'Standard Features' : 'Neural Augmented Access'}
                                                            </p>
                                                        </div>
                                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                                            <FiZap size={32} />
                                                        </div>
                                                    </div>
                                                    <div className="mt-12 flex flex-wrap gap-8 items-end">
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                                                            <p className="text-xl font-black mt-1 uppercase">{user.subscription?.status || "Active"}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => setActiveTab('plans')}
                                                            className="px-6 py-3 bg-white text-indigo-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl ml-auto"
                                                        >
                                                            Change Plan
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                            </div>

                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-6">Payment Infrastructure</h4>
                                                <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[32px] flex justify-between items-center">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center border border-[var(--border-color)]">
                                                            <FiCreditCard />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black uppercase tracking-widest">Visa ending in •••• 4242</p>
                                                            <p className="text-[10px] font-bold opacity-50">Expires 12/2028</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:underline">Edit Method</button>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-6">Archived Manifests (Invoices)</h4>
                                                <div className="space-y-3">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="flex items-center justify-between p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl hover:border-indigo-500/20 transition group">
                                                            <div className="flex items-center gap-4">
                                                                <FiArchive className="opacity-40" />
                                                                <span className="text-xs font-black uppercase tracking-widest">INV-2026-00{i}</span>
                                                            </div>
                                                            <div className="flex items-center gap-6">
                                                                <span className="text-xs font-black italic opacity-40">Feb 24, 2026</span>
                                                                <button className="p-2 transition hover:text-indigo-500"><FiExternalLink /></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Advanced Tab */}
                                    {activeTab === 'advanced' && (
                                        <div className="space-y-10">
                                            <div className="p-8 bg-amber-500/5 rounded-[40px] border border-amber-500/20 flex gap-6 items-start">
                                                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex flex-shrink-0 items-center justify-center text-amber-500">
                                                    <FiShield size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black uppercase tracking-widest text-amber-500">System Integrity Protocols</h3>
                                                    <p className="text-sm font-bold opacity-60 mt-2 leading-relaxed">
                                                        Modifying these parameters may affect the synchronization accuracy and latency of your neural repository. Proceed with system-level clearance.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between p-8 bg-[var(--bg-primary)] rounded-[32px] border border-[var(--border-color)]">
                                                    <div>
                                                        <h3 className="text-sm font-black uppercase tracking-widest">Neural Beta Access</h3>
                                                        <p className="text-[10px] font-bold opacity-50 mt-1">Receive early access to experimental AI synthesis models.</p>
                                                    </div>
                                                    <Toggle checked={user.aiFeaturesEnabled} onChange={(val) => handleUpdateSettings({ aiFeaturesEnabled: val })} />
                                                </div>

                                                <div className="flex items-center justify-between p-8 bg-[var(--bg-primary)] rounded-[32px] border border-[var(--border-color)]">
                                                    <div>
                                                        <h3 className="text-sm font-black uppercase tracking-widest">Developer Debug Logic</h3>
                                                        <p className="text-[10px] font-bold opacity-50 mt-1">Expose underlying neural telemetry for advanced troubleshooting.</p>
                                                    </div>
                                                    <Toggle checked={user.debugModeEnabled} onChange={(val) => handleUpdateSettings({ debugModeEnabled: val })} />
                                                </div>
                                            </div>

                                            <div className="pt-6">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-6">Critical Operations Area</h4>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <button className="flex items-center gap-4 p-6 bg-rose-600/5 border border-rose-500/10 rounded-3xl hover:bg-rose-600/10 transition group">
                                                        <div className="w-10 h-10 bg-rose-600/10 rounded-xl flex items-center justify-center text-rose-500">
                                                            <FiDatabase />
                                                        </div>
                                                        <span className="text-xs font-black uppercase tracking-widest text-rose-500">Clear Logic Cache</span>
                                                    </button>
                                                    <button className="flex items-center gap-4 p-6 bg-rose-600/5 border border-rose-500/10 rounded-3xl hover:bg-rose-600/10 transition group text-left">
                                                        <div className="w-10 h-10 bg-rose-600/10 rounded-xl flex items-center justify-center text-rose-500">
                                                            <FiTrash2 />
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className="text-xs font-black uppercase tracking-widest text-rose-500">Deconstruct Node</span>
                                                            <p className="text-[10px] opacity-40 italic mt-0.5">Permanent account deletion</p>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </main>
                    </div>
                </div>

                {/* Footer Status */}
                <div className="max-w-7xl mx-auto px-6 mt-12 pb-12 opacity-40 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-4">
                        <span>© 2026 ANTIGRAVITY OS</span>
                        <span className="w-1 h-3 bg-indigo-500/30" />
                        <span>Build 0.8.4.2-ALPHA</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiCheck className="text-indigo-500" />
                        <span>All systems operational & synced</span>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Settings;