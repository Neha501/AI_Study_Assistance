// components/HeatmapCalendar.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import PropTypes from "prop-types";

const HeatmapCalendar = ({ data = [], onDayClick }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Default 5 weeks of data if none provided
    const displayData = data.length ? data : Array.from({ length: 35 }, () => Math.floor(Math.random() * 4));

    // Map intensity value to Tailwind class (could also be inline style for dynamic color)
    const intensityClasses = [
        "bg-slate-800",      // 0
        "bg-indigo-900",     // 1
        "bg-indigo-700",     // 2
        "bg-indigo-500"      // 3
    ];

    // Tooltip text based on intensity
    const getTooltip = (value) => {
        const hours = ["0-1h", "1-2h", "2-3h", "3-4h"][value] || "No data";
        return `Study time: ${hours}`;
    };

    return (
        <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Study Activity (Last 5 Weeks)</h2>
                <span className="text-sm text-slate-400">Darker = more hours</span>
            </div>

            <div className="grid grid-cols-7 gap-2 sm:gap-3">
                {displayData.map((value, index) => {
                    const isHovered = hoveredIndex === index;
                    return (
                        <motion.div
                            key={index}
                            className={`relative ${intensityClasses[value] || "bg-slate-800"} 
                         w-6 h-6 sm:w-8 sm:h-8 rounded-md cursor-pointer
                         transition-all duration-200 ease-out`}
                            whileHover={{
                                scale: 1.2,
                                boxShadow: "0 0 15px rgba(99, 102, 241, 0.6)",
                                transition: { duration: 0.2 }
                            }}
                            onHoverStart={() => setHoveredIndex(index)}
                            onHoverEnd={() => setHoveredIndex(null)}
                            onClick={() => onDayClick && onDayClick(index, value)}
                        >
                            {/* Tooltip */}
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                           px-2 py-1 bg-slate-700 text-xs rounded whitespace-nowrap
                           border border-slate-600 shadow-lg z-10"
                                >
                                    {getTooltip(value)}
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

HeatmapCalendar.propTypes = {
    data: PropTypes.arrayOf(PropTypes.number),
    onDayClick: PropTypes.func
};

export default HeatmapCalendar;