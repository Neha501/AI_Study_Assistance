// pages/Notes.jsx
import MainLayout from "../layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import API_BASE_URL from "../config/api";
import StarfieldBackground from "../components/StarfieldBackground";
import {
    FiPlus, FiSearch, FiMessageSquare, FiBookOpen,
    FiZap, FiTrash2, FiStar, FiChevronLeft,
    FiChevronRight, FiMaximize2, FiLoader, FiArrowRight
} from "react-icons/fi";

function Notes() {
    const [notes, setNotes] = useState([]);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState(null);
    const [editorMode, setEditorMode] = useState("preview");
    const [showFlashcards, setShowFlashcards] = useState(false);
    const [flashcardIndex, setFlashcardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGenHub, setShowGenHub] = useState(false);

    // AI Hub State
    const [genTopic, setGenTopic] = useState("");
    const [genType, setGenType] = useState("notes");
    const [genCategory, setGenCategory] = useState("General");

    const categories = ["General", "DSA", "Web Dev", "OS", "Math", "Science", "History"];

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE_URL}/study`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(res.data);
            if (res.data.length > 0 && !selectedNoteId) {
                setSelectedNoteId(res.data[0]._id);
            }
        } catch (err) {
            console.error("Failed to fetch notes", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAI = async () => {
        if (!genTopic) return;
        setIsGenerating(true);
        setShowGenHub(false);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${API_BASE_URL}/ai/generate`, {
                topic: genTopic,
                type: genType,
                category: genCategory
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes([res.data, ...notes]);
            setSelectedNoteId(res.data._id);
            setGenTopic("");
        } catch (err) {
            console.error("AI Generation failed", err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteNote = async (id) => {
        if (!window.confirm("Delete this study node?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_BASE_URL}/study/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updated = notes.filter(n => n._id !== id);
            setNotes(updated);
            if (selectedNoteId === id) setSelectedNoteId(updated[0]?._id || null);
        } catch (err) {
            console.error("Failed to delete", err);
        }
    };

    const handleToggleFavorite = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(`${API_BASE_URL}/study/${id}/favorite`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(notes.map(n => n._id === id ? res.data : n));
        } catch (err) {
            console.error("Failed to toggle favorite", err);
        }
    };

    const handleContentChange = async (id, content) => {
        const updatedNotes = notes.map(n => n._id === id ? { ...n, content } : n);
        setNotes(updatedNotes);

        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_BASE_URL}/study/${id}`, { content }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to save content", err);
        }
    };


    const filteredNotes = notes.filter((note) => {
        const matchesSearch =
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag ? note.category === selectedTag : true;
        return matchesSearch && matchesTag;
    });

    const selectedNote = notes.find((n) => n._id === selectedNoteId);

    // Split content for flashcards if type is flashcards
    const flashcardChunks = selectedNote?.content.split("\n\n").filter(c => c.trim()) || [];

    return (
        <MainLayout>
            <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 overflow-hidden">
                <div className="dark:block hidden">
                    <StarfieldBackground starCount={800} />
                </div>
                <div className="dark:hidden absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                                Knowledge Bank
                            </h1>
                            <p className="text-[var(--text-secondary)] mt-1 font-bold text-sm tracking-tight">
                                Synthesize, learn, and master your subjects with AI.
                            </p>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowGenHub(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20"
                        >
                            <FiZap className="animate-pulse" /> AI Generation Hub
                        </motion.button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 flex-1 items-stretch">
                        {/* Sidebar */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:w-96 space-y-6 flex flex-col">
                            {/* Search & Filter */}
                            <div className="bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-color)] p-6 rounded-[32px] shadow-2xl">
                                <div className="relative mb-6">
                                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search your mind..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-[var(--bg-primary)] border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/50 font-bold transition-all"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => setSelectedTag(null)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!selectedTag ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-[var(--bg-primary)] opacity-60 hover:opacity-100'}`}>All Nodes</button>
                                    {categories.map(cat => (
                                        <button key={cat} onClick={() => setSelectedTag(cat)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedTag === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-[var(--bg-primary)] opacity-60 hover:opacity-100'}`}>{cat}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Note List */}
                            <div className="bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-color)] p-6 rounded-[32px] shadow-2xl flex-1 flex flex-col min-h-[400px]">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-6 px-2">Storage Modules</h2>
                                <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar flex-1">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                            <FiLoader className="animate-spin mb-4" size={32} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Accessing Secure Storage...</span>
                                        </div>
                                    ) : filteredNotes.length === 0 ? (
                                        <div className="text-center py-20 opacity-30">
                                            <FiBookOpen size={48} className="mx-auto mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">No data nodes found</p>
                                        </div>
                                    ) : (
                                        filteredNotes.map(note => (
                                            <motion.div
                                                key={note._id}
                                                layoutId={note._id}
                                                onClick={() => {
                                                    setSelectedNoteId(note._id);
                                                    setShowFlashcards(false);
                                                }}
                                                className={`p-5 rounded-[24px] cursor-pointer transition-all border ${selectedNoteId === note._id ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg' : 'bg-[var(--bg-primary)] border-transparent hover:border-[var(--border-color)]'}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-black text-sm truncate flex-1 pr-4">{note.title}</h3>
                                                    <span className="text-xs opacity-50 py-1 px-2 bg-[var(--bg-secondary)] rounded-lg font-black">{note.category}</span>
                                                </div>
                                                <p className="text-[10px] text-[var(--text-secondary)] line-clamp-2 font-bold opacity-60 leading-relaxed">
                                                    {note.content.substring(0, 100)}...
                                                </p>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Editor/Reader Area */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 bg-[var(--bg-secondary)] backdrop-blur-2xl p-10 rounded-[48px] border border-[var(--border-color)] shadow-2xl flex flex-col relative">
                            {isGenerating && (
                                <div className="absolute inset-0 z-50 rounded-[48px] bg-indigo-600/5 backdrop-blur-md flex flex-col items-center justify-center">
                                    <div className="w-24 h-24 relative">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500/30 border-l-transparent rounded-full"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <FiZap size={32} className="text-indigo-500 animate-pulse" />
                                        </div>
                                    </div>
                                    <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-indigo-500 animate-pulse text-center leading-relaxed">
                                        AI SYNTHESIS IN PROGRESS...<br />
                                        <span className="opacity-50 text-[10px]">CONSTRUCTING KNOWLEDGE LATTICE</span>
                                    </p>
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                {selectedNote ? (
                                    <motion.div key={selectedNote._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col h-full">
                                        <div className="flex flex-wrap justify-between items-center gap-6 mb-12">
                                            <div className="flex bg-[var(--bg-primary)] p-1.5 rounded-2xl border border-[var(--border-color)]">
                                                <button onClick={() => setEditorMode("edit")} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${editorMode === "edit" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "opacity-40 hover:opacity-100"}`}>Draft</button>
                                                <button onClick={() => setEditorMode("preview")} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${editorMode === "preview" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "opacity-40 hover:opacity-100"}`}>Visualize</button>
                                                <button onClick={() => setShowFlashcards(!showFlashcards)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${showFlashcards ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "opacity-40 hover:opacity-100"}`}>Mastery</button>
                                            </div>
                                            <div className="flex gap-4">
                                                <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDeleteNote(selectedNote._id)} className="w-12 h-12 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20 hover:bg-rose-500/20 transition-all"><FiTrash2 size={20} /></motion.button>
                                                <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleToggleFavorite(selectedNote._id)} className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${selectedNote.favorite ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/30' : 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'}`}><FiStar size={20} /></motion.button>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col min-h-0">
                                            <h2 className="text-4xl font-black mb-6 leading-tight pr-10">{selectedNote.title}</h2>

                                            <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-2 no-scrollbar">
                                                <span className="px-4 py-2 bg-indigo-600/10 text-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">{selectedNote.category}</span>
                                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Synchronized on {new Date(selectedNote.createdAt).toLocaleDateString()}</span>
                                            </div>

                                            {showFlashcards ? (
                                                <div className="flex-1 flex flex-col items-center justify-center pb-10">
                                                    <div className="w-full max-w-2xl">
                                                        <div className="flex justify-between items-center mb-8 bg-[var(--bg-primary)] p-4 rounded-3xl border border-[var(--border-color)]">
                                                            <button onClick={() => { setFlashcardIndex(i => i > 0 ? i - 1 : flashcardChunks.length - 1); setIsFlipped(false); }} className="p-3 hover:bg-[var(--bg-secondary)] rounded-2xl transition-all"><FiChevronLeft size={24} /></button>
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-xs font-black tracking-widest uppercase">Recall Test</span>
                                                                <span className="text-[10px] font-bold opacity-40">{flashcardIndex + 1} of {flashcardChunks.length} Modules</span>
                                                            </div>
                                                            <button onClick={() => { setFlashcardIndex(i => i < flashcardChunks.length - 1 ? i + 1 : 0); setIsFlipped(false); }} className="p-3 hover:bg-[var(--bg-secondary)] rounded-2xl transition-all"><FiChevronRight size={24} /></button>
                                                        </div>
                                                        <motion.div
                                                            className={`w-full min-h-[350px] bg-gradient-to-br transition-all duration-500 rounded-[48px] p-12 flex items-center justify-center text-center cursor-pointer shadow-3xl relative overflow-hidden group border-2 ${isFlipped ? 'from-purple-600 to-indigo-700 text-white border-transparent' : 'from-[var(--bg-primary)] to-[var(--bg-primary)] border-[var(--border-color)]'}`}
                                                            onClick={() => setIsFlipped(!isFlipped)}
                                                            whileHover={{ scale: 1.02 }}
                                                        >
                                                            <AnimatePresence mode="wait">
                                                                <motion.div
                                                                    key={isFlipped ? 'back' : 'front'}
                                                                    initial={{ opacity: 0, rotateY: 90 }}
                                                                    animate={{ opacity: 1, rotateY: 0 }}
                                                                    exit={{ opacity: 0, rotateY: -90 }}
                                                                    transition={{ duration: 0.3 }}
                                                                    className="text-xl md:text-2xl font-black leading-relaxed"
                                                                >
                                                                    {flashcardChunks[flashcardIndex] || "INITIALIZING DATA..."}
                                                                </motion.div>
                                                            </AnimatePresence>
                                                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] opacity-40 animate-bounce">Click to Flip</div>
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex-1 overflow-y-auto pr-6 custom-scrollbar pb-10">
                                                    {editorMode === "edit" ? (
                                                        <textarea
                                                            value={selectedNote.content}
                                                            onChange={(e) => handleContentChange(selectedNote._id, e.target.value)}
                                                            className="w-full h-full min-h-[400px] bg-transparent border-none focus:ring-0 p-0 font-bold text-lg leading-relaxed text-[var(--text-primary)] placeholder-opacity-20 resize-none"
                                                            placeholder="Initialize content synthesis..."
                                                        />
                                                    ) : (
                                                        <div className="prose prose-invert max-w-none font-bold text-lg leading-relaxed content-view">
                                                            <ReactMarkdown>{selectedNote.content || "_NO DATA RECEIVED_"}</ReactMarkdown>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full opacity-20">
                                        <FiMaximize2 size={64} className="mb-6" />
                                        <h3 className="text-xl font-black uppercase tracking-[0.4em]">SELECT NODE</h3>
                                        <p className="mt-2 text-sm font-bold">Synchronize with a knowledge unit to begin.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>

                {/* AI HUB MODAL */}
                <AnimatePresence>
                    {showGenHub && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowGenHub(false)} className="absolute inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-xl" />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                                className="relative w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] p-12 rounded-[56px] shadow-[0_48px_128px_-32px_rgba(0,0,0,0.5)] overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[120px] rounded-full -mr-32 -mt-32" />

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-indigo-600/40">
                                        <FiZap size={40} className="text-white animate-pulse" />
                                    </div>
                                    <h3 className="text-4xl font-black mb-2 text-center uppercase tracking-tight">AI Synthesis Hub</h3>
                                    <p className="text-[var(--text-secondary)] font-bold text-sm mb-12 opacity-60">Architect your study materials with Neural AI.</p>

                                    <div className="w-full space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 px-1">Subject Topic</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Quantum Entanglement, Web 3.0..."
                                                value={genTopic}
                                                onChange={(e) => setGenTopic(e.target.value)}
                                                className="w-full bg-[var(--bg-primary)] border-none rounded-[24px] py-6 px-8 text-lg font-black focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-inner"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 px-1">Content Strategy</label>
                                                <select
                                                    value={genType}
                                                    onChange={(e) => setGenType(e.target.value)}
                                                    className="w-full bg-[var(--bg-primary)] border-none rounded-[24px] py-6 px-8 text-sm font-black focus:ring-4 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="notes">Comprehensive Notes</option>
                                                    <option value="flashcards">Recall Flashcards</option>
                                                    <option value="summary">Concise Summary</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 px-1">Taxonomy</label>
                                                <select
                                                    value={genCategory}
                                                    onChange={(e) => setGenCategory(e.target.value)}
                                                    className="w-full bg-[var(--bg-primary)] border-none rounded-[24px] py-6 px-8 text-sm font-black focus:ring-4 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                                                >
                                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="pt-8">
                                            <motion.button
                                                whileHover={{ scale: 1.02, y: -5 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleGenerateAI}
                                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-4 group"
                                            >
                                                Initialize Neural Synthesis <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
                .shadow-3xl { shadow: 0 32px 64px -16px rgba(0,0,0,0.5); }
                .content-view { color: var(--text-primary); }
                .content-view h1, .content-view h2, .content-view h3 { font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; margin-top: 2rem; margin-bottom: 1rem; color: #6366f1; }
                .content-view p { margin-bottom: 1.5rem; }
                .content-view ul, .content-view ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
                .content-view li { margin-bottom: 0.5rem; }
            `}</style>
        </MainLayout>
    );
}



export default Notes;
