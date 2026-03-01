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
import {
  Sun, Moon, User, LogOut, UserCog, Palette
} from "lucide-react";

export const FloatingNav = ({ navItems, className }) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const { theme, toggleTheme, isBlock, toggleUiStyle } = useTheme();
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
          "flex max-w-fit fixed top-6 inset-x-0 mx-auto transition-all duration-300 z-[5000] items-center justify-center gap-2",
          isBlock
            ? "border-2 border-slate-900 rounded-[1.5rem] bg-white dark:bg-neutral-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] px-4 py-3"
            : "border border-gray-200/50 dark:border-neutral-700/50 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] dark:shadow-[0px_2px_20px_-1px_rgba(0,0,0,0.3)] pr-2 pl-3 py-2",
          className
        )}
      >
        {/* Brand Logo */}
        <Link to="/" className={cn("flex items-center gap-2 group", isBlock ? "mr-4" : "mr-2")}>
          <div className={cn(
            "flex items-center justify-center transition-all duration-300",
            isBlock
              ? "w-10 h-10 bg-amber-500 rounded-xl border-2 border-slate-900 group-hover:-translate-y-1 group-hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
              : "w-8 h-8 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-lg shadow-md hover:shadow-cyan-500/40"
          )}>
            <svg className={cn("text-white", isBlock ? "w-6 h-6" : "w-4 h-4")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isBlock ? 2.5 : 2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          {isBlock ? (
            <span className="hidden md:block text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
              Edu<span className="text-blue-600">Space</span>
            </span>
          ) : (
            <span className="hidden md:block text-sm font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              EduSpace
            </span>
          )}
        </Link>

        <div className="w-0.5 h-6 bg-slate-200 dark:bg-neutral-700 mx-1"></div>

        {navItems.map((navItem, idx) => (
          <Link
            key={`link-${idx}`}
            to={navItem.link}
            className={cn(
              "relative px-4 py-2 items-center flex gap-1.5 transition-all duration-200",
              isBlock
                ? "rounded-xl text-sm font-bold border-2 border-transparent"
                : "rounded-full text-sm font-medium",
              isBlock && navItem.active
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-400 border-amber-500"
                : !isBlock && navItem.active
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25"
                  : isBlock
                    ? "text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-neutral-800 hover:border-slate-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block">{navItem.name}</span>
          </Link>
        ))}

        {/* UI Style Toggle */}
        <button
          onClick={toggleUiStyle}
          className={cn(
            "p-2 ml-2 transition-all",
            isBlock
              ? "rounded-xl border-2 border-slate-900 dark:border-neutral-700 hover:bg-amber-100 dark:hover:bg-neutral-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-none"
              : "rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300"
          )}
          aria-label="Toggle UI Style"
          title="Switch Style Theme"
        >
          <Palette className={cn("w-4 h-4", isBlock ? "text-slate-900 dark:text-white" : "")} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            "p-2 transition-all",
            isBlock
              ? "rounded-xl border-2 border-slate-900 dark:border-neutral-700 hover:bg-amber-100 dark:hover:bg-neutral-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-none"
              : "rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 ml-1"
          )}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className={cn("w-4 h-4", isBlock ? "text-slate-900 dark:text-white" : "")} />
          ) : (
            <Sun className={cn("w-4 h-4", isBlock ? "text-amber-500" : "text-yellow-400")} />
          )}
        </button>

        {/* Auth Section */}
        {isAuthenticated ? (
          <>
            <Link
              to={getDashboardLink()}
              className={cn(
                "relative text-sm px-4 py-2 transition ml-1 flex items-center gap-2",
                isBlock
                  ? "border-[2px] font-bold border-slate-900 dark:border-neutral-700 rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-none text-slate-900 dark:text-white"
                  : "border font-medium border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white rounded-full hover:bg-gray-50 dark:hover:bg-neutral-800"
              )}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user?.name?.split(' ')[0] || 'Dashboard'}</span>
            </Link>
            <Link
              to="/profile"
              className={cn(
                "p-2 transition ml-1",
                isBlock
                  ? "rounded-xl border-2 border-slate-900 dark:border-neutral-700 hover:bg-amber-100 dark:hover:bg-neutral-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-none text-slate-700 dark:text-gray-300"
                  : "rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300"
              )}
              aria-label="Edit Profile"
              title="Edit Profile"
            >
              <UserCog className="w-4 h-4" />
            </Link>
            <button
              onClick={logout}
              className={cn(
                "p-2 transition ml-1",
                isBlock
                  ? "rounded-xl border-2 border-slate-900 dark:border-neutral-700 hover:bg-red-100 dark:hover:bg-red-900/40 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-none text-red-600 dark:text-red-400"
                  : "rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300"
              )}
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={cn(
              "relative text-sm px-4 py-2 transition ml-1 overflow-hidden",
              isBlock
                ? "border-2 font-bold border-slate-900 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-none px-6"
                : "border font-medium border-blue-500/50 text-blue-700 rounded-full hover:bg-blue-50 hover:border-blue-500"
            )}
          >
            <span>Login</span>
            {!isBlock && <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-px" />}
          </Link>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingNav;

