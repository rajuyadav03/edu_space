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
import { useAuth } from "../../context/AuthContext";
import { Sun, Moon, User, LogOut } from "lucide-react";

export const FloatingNav = ({ navItems, className }) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

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

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin-dashboard";
    if (user?.role === "school") return "/school-dashboard";
    return "/teacher-dashboard";
  };

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
          "flex max-w-fit fixed top-6 inset-x-0 mx-auto border border-gray-200/50 dark:border-neutral-700/50 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] dark:shadow-[0px_2px_20px_-1px_rgba(0,0,0,0.3)] z-[5000] pr-2 pl-3 py-2 items-center justify-center gap-1",
          className
        )}
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 mr-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-cyan-500/40 transition-shadow duration-300">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="hidden md:block text-sm font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            EduSpace
          </span>
        </Link>

        <div className="w-px h-5 bg-gray-200 dark:bg-neutral-700 mx-1"></div>

        {navItems.map((navItem, idx) => (
          <Link
            key={`link-${idx}`}
            to={navItem.link}
            className={cn(
              "relative px-4 py-2 rounded-full items-center flex gap-1.5 text-sm font-medium transition-all duration-200",
              navItem.active
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block">{navItem.name}</span>
          </Link>
        ))}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition ml-2"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun className="w-4 h-4 text-yellow-400" />
          )}
        </button>

        {/* Auth Section */}
        {isAuthenticated ? (
          <>
            <Link
              to={getDashboardLink()}
              className="border text-sm font-medium relative border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white px-4 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-800 transition ml-1 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user?.name?.split(' ')[0] || 'Dashboard'}</span>
            </Link>
            <button
              onClick={logout}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition text-gray-700 dark:text-gray-300"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="border text-sm font-medium relative border-blue-500/50 dark:border-cyan-400/50 text-blue-700 dark:text-cyan-300 px-4 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/30 transition ml-1 hover:border-blue-500 dark:hover:border-cyan-400"
          >
            <span>Login</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-px" />
          </Link>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingNav;

