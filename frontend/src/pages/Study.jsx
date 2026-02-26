// pages/Study.jsx
import { useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import StarfieldBackground from "../components/StarfieldBackground";
import { FiBookOpen, FiZap, FiTarget, FiArrowRight } from "react-icons/fi";
import API_BASE_URL from "../config/api";

function Study() {
    const [topic, setTopic] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const generateNotes = async () => {
        if (!topic) return;
        setLoading(true);
        try {
            const res = await axios.post(
                `${API_BASE_URL}/ai/generate`,
                { topic },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }

            );
            setNotes(res.data.content || res.data.notes);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 overflow-hidden">
                <div className="dark:block hidden">
                    <StarfieldBackground starCount={1000} />
                </div>
                <div className="dark:hidden absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16 space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <FiBookOpen /> Focus Mode
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic">Neural Sync</h1>
                        <p className="text-lg font-medium opacity-60 max-w-xl mx-auto italic">"Target a cognitive node and let the AI synthesize the foundation for your mastery."</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[var(--bg-secondary)] backdrop-blur-md p-10 rounded-[40px] border border-[var(--border-color)] shadow-2xl">
                        <div className="space-y-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter Study Vector (e.g. Quantum Mechanics, React Hooks)"
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl py-6 px-8 font-bold text-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:opacity-30"
                                    onChange={(e) => setTopic(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && generateNotes()}
                                />
                                <button
                                    onClick={generateNotes}
                                    disabled={loading || !topic}
                                    className="absolute right-3 top-3 bottom-3 px-8 bg-indigo-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? "Syncing..." : <>Initiate <FiArrowRight /></>}
                                </button>
                            </div>

                            <AnimatePresence>
                                {notes && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-12 p-10 bg-[var(--bg-primary)] rounded-[32px] border border-[var(--border-color)] prose prose-invert max-w-none text-lg font-medium italic opacity-80 leading-relaxed"
                                    >
                                        <div className="flex items-center gap-3 mb-8 text-indigo-500 not-italic">
                                            <FiZap size={24} />
                                            <span className="font-black uppercase tracking-widest text-xs">Synthesis Result</span>
                                        </div>
                                        <pre className="whitespace-pre-wrap font-sans">
                                            {notes}
                                        </pre>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}

export default Study;