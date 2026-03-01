import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Quote, Star, CheckCircle2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { isBlock } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, rememberMe);

      if (result.success) {
        // Navigate based on user role
        const userRole = result.user?.role || user?.role;
        if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else if (userRole === "school") {
          navigate("/school-dashboard");
        } else {
          navigate("/teacher-dashboard");
        }
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("min-h-screen flex", isBlock ? "bg-[#FFFBEB] dark:bg-neutral-950" : "bg-slate-50 dark:bg-neutral-950")}>
      {/* Left Side - Visual Content */}
      <div className={cn("hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden", isBlock ? "bg-amber-400 border-r-4 border-slate-900" : "bg-gradient-to-br from-blue-600 to-indigo-700")}>
        {isBlock ? (
          // Brutalist Design
          <div className="relative z-10 w-full max-w-lg">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white border-4 border-slate-900 p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] mb-8 transform -rotate-2">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-none">Join the<br />Revolution.</h2>
              <p className="font-bold text-slate-700 text-lg">Find spaces that inspire, create, and elevate your learning experience.</p>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-sky-300 border-4 border-slate-900 p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transform rotate-2">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-slate-900 overflow-hidden bg-white shrink-0">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase leading-tight">Sarah Jenkins</h4>
                  <p className="font-bold text-slate-800 text-sm">Design Educator</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-slate-900 text-slate-900" />)}
                  </div>
                </div>
              </div>
              <p className="font-bold text-slate-900">"EduSpace completely changed how I host my workshops. The brutalist filtering makes finding the right vibe effortless!"</p>
            </motion.div>
          </div>
        ) : (
          // Soft Educational Design
          <>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-400 mix-blend-multiply filter blur-3xl opacity-50 animate-[pulse_8s_ease-in-out_infinite]"></div>
              <div className="absolute top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-400 mix-blend-multiply filter blur-3xl opacity-50 animate-[pulse_10s_ease-in-out_infinite]"></div>
              <div className="absolute -bottom-[20%] left-[20%] w-[70%] h-[70%] rounded-full bg-purple-400 mix-blend-multiply filter blur-3xl opacity-50 animate-[pulse_12s_ease-in-out_infinite]"></div>
            </div>

            <div className="relative z-10 w-full max-w-lg text-white">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="mb-12">
                <h2 className="text-5xl font-bold mb-6 leading-tight">Your gateway to<br /><span className="text-blue-200">better learning</span>.</h2>
                <p className="text-xl text-blue-100/90 leading-relaxed">Discover inspiring educational spaces tailored to your unique teaching style.</p>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
                <Quote className="w-10 h-10 text-white/40 mb-4" />
                <p className="text-lg text-white font-medium mb-6 leading-relaxed">"The platform is incredibly intuitive. I found the perfect studio for my masterclass within minutes."</p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mia" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-white" />
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Leo" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-white" />
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nala" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-white" />
                  </div>
                  <div className="text-sm border-l border-white/20 pl-4 ml-2">
                    <div className="font-semibold text-white flex items-center gap-1">Trusted by 10k+ <CheckCircle2 className="w-4 h-4 text-blue-300" /></div>
                    <div className="text-blue-200/80">educators worldwide</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>

      {/* Right Side - Form */}
      <div className={cn("w-full lg:w-1/2 flex items-center justify-center p-8", isBlock ? "bg-[#FFFBEB] dark:bg-neutral-950" : "bg-white dark:bg-neutral-950")}>
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className={cn("w-12 h-12 flex items-center justify-center", isBlock ? "bg-amber-300 border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]" : "bg-blue-600 rounded-xl")}>
              <svg className={cn("w-7 h-7", isBlock ? "text-slate-900" : "text-white")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isBlock ? 2.5 : 2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className={cn("text-2xl", isBlock ? "font-black uppercase tracking-tight text-slate-900 dark:text-white" : "font-bold text-gray-900 dark:text-white")}>EduSpace</span>
          </Link>

          {/* Header */}
          <div className="mb-10">
            <h2 className={cn("text-4xl mb-3", isBlock ? "font-black text-slate-900 dark:text-white uppercase tracking-tight" : "font-bold text-gray-900 dark:text-white")}>Sign In</h2>
            <p className={cn("text-lg", isBlock ? "font-bold text-slate-600 dark:text-gray-400" : "text-gray-600 dark:text-gray-400")}>Access your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <motion.form variants={containerVariants} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className={cn("block text-sm mb-2", isBlock ? "font-black uppercase tracking-wide text-slate-900 dark:text-gray-200" : "font-semibold text-gray-900 dark:text-gray-200")}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={cn("h-5 w-5", isBlock ? "text-slate-900" : "text-gray-400")} />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={cn(
                    "w-full pl-11 pr-4 py-3.5 transition disabled:opacity-50",
                    isBlock
                      ? "bg-white dark:bg-neutral-900 border-4 border-slate-900 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] focus:translate-y-[2px] focus:shadow-none focus:outline-none"
                      : "border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-white bg-white dark:bg-neutral-900"
                  )}
                  placeholder="you@example.com"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className={cn("block text-sm mb-2", isBlock ? "font-black uppercase tracking-wide text-slate-900 dark:text-gray-200" : "font-semibold text-gray-900 dark:text-gray-200")}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={cn("h-5 w-5", isBlock ? "text-slate-900" : "text-gray-400")} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={cn(
                    "w-full pl-11 pr-12 py-3.5 transition disabled:opacity-50",
                    isBlock
                      ? "bg-white dark:bg-neutral-900 border-4 border-slate-900 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] focus:translate-y-[2px] focus:shadow-none focus:outline-none"
                      : "border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-white bg-white dark:bg-neutral-900"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={cn(
                    "w-5 h-5 transition-all outline-none focus:ring-0",
                    isBlock
                      ? "border-2 border-slate-900 dark:border-slate-600 rounded-md bg-white dark:bg-neutral-900 checked:bg-amber-400 text-slate-900 checked:border-slate-900 dark:checked:border-slate-500 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
                      : "border-gray-300 rounded text-blue-600 focus:ring-blue-600"
                  )}
                />
                <span className={cn("ml-3 text-sm transition-colors", isBlock ? "font-bold text-slate-900 dark:text-gray-200" : "text-gray-700 dark:text-gray-300")}>Remember me</span>
              </label>
              <Link to="/forgot-password" className={cn("text-sm hover:underline", isBlock ? "font-black text-blue-600 dark:text-blue-400 uppercase" : "text-blue-600 dark:text-blue-400 font-medium")}>
                Forgot password?
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full py-4 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group",
                  isBlock
                    ? "bg-amber-300 text-slate-900 border-4 border-slate-900 dark:border-slate-700 rounded-xl font-black text-lg uppercase tracking-wider shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
                    : "bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-md"
                )}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In {isBlock ? <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> : null}
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={cn("px-4", isBlock ? "bg-[#FFFBEB] dark:bg-neutral-950 text-slate-500" : "bg-white dark:bg-neutral-950 text-gray-500 dark:text-gray-400")}>Or continue with</span>
            </div>
          </motion.div>

          {/* Social Login */}
          <motion.div variants={itemVariants}>
            <a
              href={`${import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api"}/auth/google`}
              className={cn(
                "w-full flex items-center justify-center gap-3 px-4 py-3.5 transition",
                isBlock
                  ? "bg-white border-4 border-slate-900 dark:border-slate-700 rounded-xl font-black text-slate-900 uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-[2px] hover:bg-slate-50 dark:hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
                  : "border border-gray-300 dark:border-neutral-700 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-900"
              )}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </a>
          </motion.div>

          {/* Sign Up Link */}
          <motion.p variants={itemVariants} className={cn("text-center mt-8", isBlock ? "font-bold text-slate-700 dark:text-gray-300" : "text-gray-600 dark:text-gray-400")}>
            Don't have an account?{" "}
            <Link to="/register" className={cn("hover:underline", isBlock ? "font-black text-blue-600 dark:text-blue-400 uppercase ml-1" : "text-blue-600 dark:text-blue-400 font-semibold")}>
              Sign up
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
