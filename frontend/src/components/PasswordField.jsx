// components/PasswordField.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';

const PasswordField = ({ value, onChange, label, required }) => {
    const [showPassword, setShowPassword] = useState(false);

    const getStrength = (pwd) => {
        let score = 0;
        if (!pwd) return 0;
        if (pwd.length > 5) score++;
        if (pwd.length > 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return Math.min(score, 4);
    };

    const strength = getStrength(value);
    const strengthText = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
    const strengthColor = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-emerald-400'];

    return (
        <div>
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-white pr-10"
                />
                <label className="absolute left-4 top-3 text-slate-400 pointer-events-none">
                    {label}
                </label>
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-indigo-400 text-sm hover:text-indigo-300"
                >
                    {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>

            {value && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                >
                    <div className="flex gap-1 h-1.5">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ width: 0 }}
                                animate={{ width: i < strength ? '25%' : 0 }}
                                className={`h-full ${strengthColor[i]} rounded-full`}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{strengthText}</p>
                </motion.div>
            )}
        </div>
    );
};
export default PasswordField;