import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { FloatingNav } from "./ui/floating-navbar";
import { Home, Compass, Building2, Menu, X, Sun, Moon, Phone, Palette } from "lucide-react";
import { cn } from "../lib/utils";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, isBlock, toggleUiStyle } = useTheme();
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <Home className="h-4 w-4" />,
      active: location.pathname === "/"
    },
    {
      name: "Explore",
      link: "/listings",
      icon: <Compass className="h-4 w-4" />,
      active: location.pathname === "/listings"
    },
    {
      name: "List Space",
      link: "/register",
      icon: <Building2 className="h-4 w-4" />,
      active: location.pathname === "/register"
    },
  ];

  return (
    <>
      {/* Desktop Floating Nav */}
      <div className="hidden lg:block">
        <FloatingNav navItems={navItems} />
      </div>

      {/* Mobile Nav */}
      <nav className={cn("lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300", !isBlock && "px-6 py-4 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-gray-100 dark:border-neutral-800")}>
        <div className={cn("flex items-center justify-between transition-all", isBlock && "mx-4 mt-4 px-5 py-4 bg-white dark:bg-neutral-900 border-2 border-slate-900 dark:border-neutral-700 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]")}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center border-2 border-slate-900 group-hover:-translate-y-1 group-hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all duration-200 relative">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <svg className="absolute w-3 h-3 -top-0.5 -right-0.5 text-amber-300 logo-spark" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8L8 14l-6-4.8h7.6z" />
              </svg>
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">
              Edu<span className="text-blue-600">Space</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* UI Style Toggle */}
            <button
              onClick={toggleUiStyle}
              className={cn(
                "p-2 transition-all",
                isBlock
                  ? "border-2 border-slate-900 dark:border-neutral-700 rounded-xl hover:bg-amber-100 dark:hover:bg-neutral-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-none bg-white dark:bg-neutral-900"
                  : "rounded-full hover:bg-gray-100 dark:hover:bg-neutral-900"
              )}
              aria-label="Toggle UI Style"
            >
              <Palette className={cn("w-5 h-5", isBlock ? "text-slate-900 dark:text-white" : "text-gray-700")} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "p-2 transition-all",
                isBlock
                  ? "border-2 border-slate-900 dark:border-neutral-700 rounded-xl hover:bg-amber-100 dark:hover:bg-neutral-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-none bg-white dark:bg-neutral-900"
                  : "rounded-full hover:bg-gray-100 dark:hover:bg-neutral-900"
              )}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className={cn("w-5 h-5", isBlock ? "text-slate-900" : "text-gray-700")} />
              ) : (
                <Sun className={cn("w-5 h-5", isBlock ? "text-amber-500" : "text-yellow-400")} />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "p-2 transition-all",
                isBlock
                  ? "border-2 border-slate-900 dark:border-neutral-700 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-none"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
              )}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            isBlock ? "mx-4" : "",
            mobileMenuOpen ? (isBlock ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-96 opacity-100 mt-4') : 'max-h-0 opacity-0'
          )}
        >
          <div className={cn(
            "overflow-hidden",
            isBlock
              ? "bg-white dark:bg-neutral-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900 dark:border-neutral-700"
              : "bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800"
          )}>
            <div className={cn("flex flex-col", isBlock && "p-2 gap-1")}>
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.link}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 transition-all",
                    isBlock
                      ? "px-5 py-3 font-bold rounded-xl border-2 border-transparent"
                      : "px-6 py-4 font-medium border-b border-gray-100 dark:border-neutral-800",
                    isBlock && item.active
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-400 border-amber-500"
                      : !isBlock && item.active
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                        : isBlock
                          ? "text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-neutral-800 hover:border-slate-200"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "transition-all text-center",
                  isBlock
                    ? "px-5 py-3 mt-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-none"
                    : "px-6 py-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 border-b border-gray-100 dark:border-neutral-800"
                )}
              >
                Login
              </Link>
              <div className="px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-neutral-950">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+919876543210" className="text-sm font-medium">
                    +91 98765 43210
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

