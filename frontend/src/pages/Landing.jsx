// pages/Landing.jsx
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import GravityParticles from "../components/GravityParticles";
import StarfieldBackground from "../components/StarfieldBackground";
import { FiArrowRight, FiZap, FiTarget, FiBox, FiShield } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";

function Landing() {
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { scrollY } = useScroll();
    const yHero = useTransform(scrollY, [0, 500], [0, 100]);
    const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

    useEffect(() => {
        const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <StarfieldBackground starCount={1500} shootingStarRate={0.02} />
                <GravityParticles mousePosition={mousePosition} />
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full animate-pulse" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                {/* Navbar */}
                <motion.nav
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex justify-between items-center mb-24 glass-nav px-8 py-4 rounded-2xl"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <FiShield size={20} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Antigravity <span className="text-cyan-400">OS</span></h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate("/pricing")} className="隐藏 md:block text-sm font-medium hover:text-cyan-400 transition flex items-center gap-2">
                            <FaCrown className="text-cyan-400" /> Subscription
                        </button>
                        <button onClick={() => navigate("/login")} className="text-sm font-medium opacity-60 hover:opacity-100 transition">Login</button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/register")}
                            className="premium-button py-2 px-6 text-sm"
                        >
                            Get Started
                        </motion.button>
                    </div>
                </motion.nav>

                {/* Hero Section */}
                <motion.div style={{ y: yHero, opacity: opacityHero }} className="flex flex-col items-center text-center space-y-10 mb-40 mt-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-semibold tracking-wide uppercase"
                    >
                        Future of Intelligent Learning
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl md:text-8xl font-extrabold leading-tight tracking-tight"
                    >
                        Master Anything with <br />
                        <span className="premium-gradient-text">Neural Precision.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed"
                    >
                        The ultimate AI-driven workspace for students and researchers.
                        Organize knowledge, generate insights, and accelerate your path to mastery.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/register")}
                            className="premium-button text-base px-10 py-4 flex items-center justify-center gap-3"
                        >
                            Start Learning Now <FiArrowRight />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/pricing")}
                            className="premium-button-outline text-base px-10 py-4 flex items-center justify-center gap-2"
                        >
                            View Pricing Plan
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Features Section */}
                <div className="grid lg:grid-cols-3 gap-8 mb-40">
                    <FeatureCard
                        title="Neural Notes"
                        desc="Auto-synthesize knowledge into interconnected nodes using advanced LLMs."
                        icon={<FiZap size={28} />}
                        delay={0.5}
                    />
                    <FeatureCard
                        title="Deep Analytics"
                        desc="Visualize your cognitive growth with predictive performance vectors."
                        icon={<FiTarget size={28} />}
                        delay={0.6}
                    />
                    <FeatureCard
                        title="Smart Vault"
                        desc="Secure, encrypted storage for your entire academic history, accessible anywhere."
                        icon={<FiBox size={28} />}
                        delay={0.7}
                    />
                </div>

                {/* Footer Section */}
                <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm border-t border-white/5 pt-12 gap-8 mb-12">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-slate-300">ANTIGRAVITY OS</span>
                        <span className="opacity-20">|</span>
                        <span>v0.9.1 PRE-RELEASE</span>
                    </div>
                    <div className="flex items-center gap-8">
                        <span className="hover:text-cyan-400 cursor-pointer transition">Privacy</span>
                        <span className="hover:text-cyan-400 cursor-pointer transition">Terms</span>
                        <span className="hover:text-cyan-400 cursor-pointer transition">API Docs</span>
                        <span className="hover:text-cyan-400 cursor-pointer transition">Contact</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ title, desc, icon, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="group p-8 glass-card hover:bg-slate-800/40 transition-all duration-500"
        >
            <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-500 shadow-lg shadow-cyan-500/5">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{desc}</p>
        </motion.div>
    );
}

export default Landing;
