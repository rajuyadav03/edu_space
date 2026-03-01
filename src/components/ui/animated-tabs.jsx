import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

export const AnimatedTabs = ({
    tabs,
    activeTab,
    setActiveTab,
    className,
    tabClassName,
    activeTabClassName,
}) => {
    const { isBlock } = useTheme();

    return (
        <div
            className={cn(
                "flex items-center justify-start overflow-x-auto no-scrollbar gap-2 p-1 relative",
                className
            )}
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.value;

                return (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={cn(
                            "relative px-6 py-2.5 text-sm font-bold transition-colors whitespace-nowrap z-10",
                            isBlock ? "rounded-xl border-2 border-transparent transition-all" : "rounded-full",
                            isActive
                                ? cn(isBlock ? "text-slate-900 border-slate-900 dark:border-white dark:text-white bg-amber-300 dark:bg-amber-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]" : "text-blue-700 dark:text-white", activeTabClassName)
                                : cn(isBlock ? "text-slate-500 dark:text-gray-400 hover:border-slate-300 dark:hover:border-neutral-600" : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200", tabClassName)
                        )}
                    >
                        {isActive && !isBlock && (
                            <motion.div
                                layoutId="active-tab-indicator"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10"
                            />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};
