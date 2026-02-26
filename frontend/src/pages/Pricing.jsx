import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCheck, FaCrown, FaStar, FaRocket,
    FaMobileAlt, FaCreditCard, FaUniversity, FaTimes, FaSpinner
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

// Maps display name → backend plan name & price
const PLAN_MAP = {
    Scholar: { backendPlan: 'Free', price: 0, priceDisplay: 'Free' },
    Genius: { backendPlan: 'Pro', price: 999, priceDisplay: '₹999' },
    Master: { backendPlan: 'Enterprise', price: 2999, priceDisplay: '₹2,999' },
};

const PAYMENT_METHODS = [
    { id: 'phonepe', name: 'PhonePe / UPI', icon: FaMobileAlt, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'card', name: 'Credit / Debit Card', icon: FaCreditCard, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'netbanking', name: 'Net Banking', icon: FaUniversity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

// ─── Pricing Card ──────────────────────────────────────────────────────────────
const PricingCard = ({ title, priceDisplay, features, icon: Icon, recommended, delay, onSelect }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        className={`glass-card p-8 flex flex-col items-center text-center relative overflow-hidden ${recommended ? 'border-cyan-400/50 scale-105 z-10' : 'border-white/5'}`}
    >
        {recommended && (
            <div className="absolute top-0 right-0 bg-cyan-400 text-slate-950 px-4 py-1 text-sm font-bold rounded-bl-xl">
                BEST VALUE
            </div>
        )}

        <div className={`p-4 rounded-2xl mb-6 ${recommended ? 'bg-cyan-400/20 text-cyan-400' : 'bg-slate-800/50 text-slate-400'}`}>
            <Icon size={32} />
        </div>

        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="text-5xl font-extrabold mb-6">{priceDisplay}
            {priceDisplay !== 'Free' && <span className="text-slate-400 text-lg font-normal ml-1">/mo</span>}
        </div>

        <ul className="space-y-4 mb-8 text-left w-full">
            {features.map((feature, i) => (
                <li key={i} className="flex items-center text-slate-300">
                    <FaCheck className="text-cyan-400 mr-3 shrink-0" size={14} />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>

        <button
            onClick={() => onSelect(title)}
            className={`w-full ${recommended ? 'premium-button' : 'premium-button-outline'}`}
        >
            {priceDisplay === 'Free' ? 'Get Started Free' : 'Upgrade Now'}
        </button>
    </motion.div>
);

// ─── Payment Modal ─────────────────────────────────────────────────────────────
const PaymentModal = ({ plan, onClose, onPay, status, isProcessing }) => {
    if (!plan) return null;
    const { backendPlan, priceDisplay } = PLAN_MAP[plan];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => !isProcessing && onClose()}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                className="relative bg-slate-900 border border-white/10 p-8 rounded-[32px] w-full max-w-md shadow-2xl"
            >
                {!isProcessing && status !== 'success' && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition"
                    >
                        <FaTimes />
                    </button>
                )}

                {status === 'success' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-10"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                            className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl"
                        >
                            <FaCheck />
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-2">Payment Successful! 🎉</h3>
                        <p className="text-slate-400">Your <span className="text-cyan-400 font-bold">{backendPlan}</span> plan is now active.</p>
                        <p className="text-slate-500 text-sm mt-2">Redirecting to dashboard...</p>
                    </motion.div>
                ) : status === 'error' ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            <FaTimes />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-rose-400">Payment Failed</h3>
                        <p className="text-slate-400 mb-6">Something went wrong. Please try again.</p>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold mb-1">Complete Payment</h3>
                            <p className="text-slate-400">
                                Upgrading to{' '}
                                <span className="text-cyan-400 font-bold">{plan} ({backendPlan})</span>
                                {' '}— <span className="text-white font-bold">{priceDisplay}/mo</span>
                            </p>
                        </div>

                        <div className="space-y-3">
                            {PAYMENT_METHODS.map(method => (
                                <button
                                    key={method.id}
                                    onClick={() => onPay(method.id)}
                                    disabled={isProcessing}
                                    className="w-full flex items-center justify-between p-4 bg-slate-800/50 border border-white/5 rounded-2xl hover:border-cyan-400/40 hover:bg-slate-800 transition group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl ${method.bg} flex items-center justify-center ${method.color}`}>
                                            {isProcessing ? (
                                                <FaSpinner className="animate-spin" size={18} />
                                            ) : (
                                                <method.icon size={20} />
                                            )}
                                        </div>
                                        <span className="font-bold">{method.name}</span>
                                    </div>
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 group-hover:border-cyan-400 transition" />
                                </button>
                            ))}
                        </div>

                        {status === 'processing' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-6 flex items-center justify-center gap-3 text-cyan-400 font-bold text-sm"
                            >
                                <FaSpinner className="animate-spin" />
                                Processing secure transaction...
                            </motion.div>
                        )}

                        <p className="text-slate-500 text-xs text-center mt-6">
                            🔒 Secured by 256-bit SSL encryption
                        </p>
                    </>
                )}
            </motion.div>
        </div>
    );
};

// ─── Main Pricing Page ─────────────────────────────────────────────────────────
const Pricing = () => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);

    const handlePlanSelect = (planTitle) => {
        if (planTitle === 'Scholar') {
            // Free plan — just redirect
            if (!localStorage.getItem('token')) {
                navigate('/register');
            } else {
                navigate('/dashboard');
            }
            return;
        }
        setSelectedPlan(planTitle);
        setPaymentStatus(null);
        setShowPaymentModal(true);
    };

    const handlePayment = async (method) => {
        setIsProcessing(true);
        setPaymentStatus('processing');
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const { backendPlan, price } = PLAN_MAP[selectedPlan];

        try {
            // 1. Initiate Payment
            const initRes = await axios.post(
                `${API_BASE_URL}/subscription/initiate-payment`,
                { plan: backendPlan, method },
                { headers: { Authorization: token } }
            );

            // 2. Simulate 2-second payment gateway interaction
            console.log('[Payment] Gateway URL:', initRes.data.paymentUrl);
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 3. Verify + activate subscription
            await axios.post(
                `${API_BASE_URL}/subscription/verify-payment`,
                {
                    transactionId: initRes.data.transactionId,
                    plan: backendPlan,
                    amount: price,
                    method
                },
                { headers: { Authorization: token } }
            );

            setPaymentStatus('success');
            setTimeout(() => navigate('/dashboard'), 3000);
        } catch (err) {
            console.error('[Payment] Error:', err);
            setPaymentStatus('error');
        } finally {
            setIsProcessing(false);
        }
    };

    const plans = [
        {
            title: 'Scholar',
            priceDisplay: 'Free',
            icon: FaStar,
            features: [
                '10 AI Generations/month',
                'Basic Study Tools',
                '50 MB Cloud Storage',
                'Community Support',
                'Standard Analytics',
            ],
            recommended: false,
            delay: 0.2,
        },
        {
            title: 'Genius',
            priceDisplay: '₹999',
            icon: FaCrown,
            features: [
                '100 AI Generations/month',
                'AI-Powered Insights',
                '500 MB Cloud Storage',
                'Priority Support',
                'Advanced Analytics',
                'Custom Study Plans',
            ],
            recommended: true,
            delay: 0.4,
        },
        {
            title: 'Master',
            priceDisplay: '₹2,999',
            icon: FaRocket,
            features: [
                '1000 AI Generations/month',
                'Team Collaboration',
                '5 GB Cloud Storage',
                'Dedicated Support',
                'Full API Access',
                'Early Beta Access',
            ],
            recommended: false,
            delay: 0.6,
        },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] py-20 px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-extrabold mb-6 premium-gradient-text"
                    >
                        Upgrade Your Education
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-2xl mx-auto"
                    >
                        Choose the plan that fits your learning style and unlock the full potential of AI-driven study assistance.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {plans.map((plan, i) => (
                        <PricingCard key={i} {...plan} onSelect={handlePlanSelect} />
                    ))}
                </div>

                <AnimatePresence>
                    {showPaymentModal && (
                        <PaymentModal
                            plan={selectedPlan}
                            onClose={() => { setShowPaymentModal(false); setPaymentStatus(null); }}
                            onPay={handlePayment}
                            status={paymentStatus}
                            isProcessing={isProcessing}
                        />
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-20 text-center"
                >
                    <p className="text-slate-500 mb-4">Trusted by over 10,000 scholars worldwide</p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center justify-center gap-2 mx-auto transition-all"
                    >
                        ← Back to Home
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Pricing;
