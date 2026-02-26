// components/SocialButton.jsx
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

const SocialButton = ({ provider, icon, onClick, loading }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            disabled={loading}
            className="glass-card py-3 px-6 flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white/5 disabled:opacity-50"
        >
            {loading ? <FaSpinner className="animate-spin text-cyan-400" /> : <span className="text-cyan-400">{icon}</span>}
            <span className="font-semibold text-sm">Continue with {provider}</span>
        </motion.button>
    );
};
export default SocialButton;