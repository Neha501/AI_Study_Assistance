// components/InputField.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';

const InputField = ({ label, type, value, onChange, required, error }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative">
            <motion.input
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => setIsFocused(e.target.value !== '')}
                required={required}
                className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-white"
            />
            <motion.label
                animate={{
                    y: isFocused || value ? -28 : 0,
                    scale: isFocused || value ? 0.85 : 1,
                    color: isFocused ? '#818cf8' : '#94a3b8',
                }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="absolute left-4 top-3 text-slate-400 pointer-events-none origin-left"
            >
                {label}
            </motion.label>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};
export default InputField;