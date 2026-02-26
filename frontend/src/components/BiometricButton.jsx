// components/BiometricButton.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFingerprint } from 'react-icons/fa';

const BiometricButton = () => {
    const [scanning, setScanning] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleScan = () => {
        setScanning(true);
        setSuccess(false);
        // Simulate fingerprint check
        setTimeout(() => {
            setScanning(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        }, 1500);
    };

    return (
        <div className="relative flex justify-center">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleScan}
                className="relative p-4 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors"
                aria-label="Use fingerprint"
            >
                <FaFingerprint size={24} />
            </motion.button>

            <AnimatePresence>
                {scanning && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute -inset-1 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"
                    />
                )}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -bottom-8 text-xs text-emerald-400"
                    >
                        Verified!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default BiometricButton;