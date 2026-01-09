import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "../../lib/utils";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export const FloatingNav = ({ navItems, className }) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current - (scrollYProgress.getPrevious() || 0);

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: 0,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-6 inset-x-0 mx-auto border border-gray-200/50 dark:border-white/[0.2] rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-4 py-2 items-center justify-center gap-1",
          className
        )}
      >
        {navItems.map((navItem, idx) => (
          <Link
            key={`link-${idx}`}
            to={navItem.link}
            className={cn(
              "relative px-4 py-2 rounded-full items-center flex gap-1 text-sm font-medium transition-all",
              navItem.active 
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900" 
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block">{navItem.name}</span>
          </Link>
        ))}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition ml-2"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun className="w-4 h-4 text-yellow-400" />
          )}
        </button>

        {/* Login Button */}
        <Link 
          to="/login"
          className="border text-sm font-medium relative border-gray-200 dark:border-white/[0.2] text-gray-900 dark:text-white px-4 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition ml-1"
        >
          <span>Login</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-gray-500 to-transparent h-px" />
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingNav;
