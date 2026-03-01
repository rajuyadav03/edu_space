import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Quote, Star, CheckCircle2, User, Phone, Building } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { isBlock } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const [userType, setUserType] = useState("teacher");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    instituteName: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: userType,
        ...(userType === "school" && { schoolName: formData.instituteName })
      };

      const result = await register(userData);

      if (result.success) {
        // Navigate based on user role
        if (userType === "school") {
          navigate("/school-dashboard");
        } else {
          navigate("/teacher-dashboard");
        }
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("min-h-screen flex", isBlock ? "bg-[#FFFBEB] dark:bg-neutral-950" : "bg-slate-50 dark:bg-neutral-950")}>
      {/* Left Side - Visual Content (Exactly like Login) */}
      <div className={cn("hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden", isBlock ? "bg-blue-500 border-r-4 border-slate-900" : "bg-gradient-to-br from-indigo-600 to-purple-700")}>
        {isBlock ? (
          // Brutalist Design
          <div className="relative z-10 w-full max-w-lg">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white border-4 border-slate-900 p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] mb-8 transform rotate-1">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-none">Start building<br />the future.</h2>
              <p className="font-bold text-slate-700 text-lg">List your space or find the perfect educational venue today.</p>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-amber-300 border-4 border-slate-900 p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transform -rotate-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-slate-900 overflow-hidden bg-white shrink-0">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase leading-tight">Marcus Thorne</h4>
                  <p className="font-bold text-slate-800 text-sm">School Administrator</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-slate-900 text-slate-900" />)}
                  </div>
                </div>
              </div>
              <p className="font-bold text-slate-900">"Listing our empty classrooms on EduSpace brought in great extra revenue and fostered a vibrant community."</p>
            </motion.div>
          </div>
        ) : (
          // Soft Educational Design
          <>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-400 mix-blend-multiply filter blur-3xl opacity-50 animate-[pulse_8s_ease-in-out_infinite]"></div>
              <div className="absolute top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-pink-400 mix-blend-multiply filter blur-3xl opacity-50 animate-[pulse_10s_ease-in-out_infinite]"></div>
              <div className="absolute -bottom-[20%] left-[20%] w-[70%] h-[70%] rounded-full bg-purple-400 mix-blend-multiply filter blur-3xl opacity-50 animate-[pulse_12s_ease-in-out_infinite]"></div>
            </div>

            <div className="relative z-10 w-full max-w-lg text-white">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="mb-12">
                <h2 className="text-5xl font-bold mb-6 leading-tight">Join our global<br /><span className="text-indigo-200">community</span>.</h2>
                <p className="text-xl text-indigo-100/90 leading-relaxed">Whether you're teaching one student or a hundred, we have the space for you.</p>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
                <Quote className="w-10 h-10 text-white/40 mb-4" />
                <p className="text-lg text-white font-medium mb-6 leading-relaxed">"The onboarding is seamless. Within 10 minutes, our entire school facility was listed and securely protected."</p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jack" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-white" />
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Avery" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-white" />
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Riley" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-white" />
                  </div>
                  <div className="text-sm border-l border-white/20 pl-4 ml-2">
                    <div className="font-semibold text-white flex items-center gap-1">Over 2,500 spaces <CheckCircle2 className="w-4 h-4 text-indigo-300" /></div>
                    <div className="text-indigo-200/80">currently listed</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>

      {/* Right Side - Form */}
      <div className={cn("w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto", isBlock ? "bg-[#FFFBEB] dark:bg-neutral-950" : "bg-white dark:bg-neutral-950")}>
        <div className="w-full max-w-md py-8">
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
            <h2 className={cn("text-4xl mb-3", isBlock ? "font-black text-slate-900 dark:text-white uppercase tracking-tight" : "font-bold text-gray-900 dark:text-white")}>Create Account</h2>
            <p className={cn("text-lg", isBlock ? "font-bold text-slate-600 dark:text-gray-400" : "text-gray-600 dark:text-gray-400")}>Choose your account type to get started</p>
          </div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">

            {/* User Type Selection */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setUserType("teacher")}
                className={cn(
                  "p-4 transition-all outline-none",
                  isBlock
                    ? cn(
                      "border-4 rounded-xl font-bold",
                      userType === "teacher"
                        ? "bg-amber-300 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                        : "bg-white border-transparent shadow-none hover:border-slate-300 dark:bg-neutral-900"
                    )
                    : cn(
                      "border-2 rounded-xl",
                      userType === "teacher"
                        ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700"
                    )
                )}
              >
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-2",
                    isBlock
                      ? (userType === "teacher" ? "bg-slate-900 dark:bg-white" : "bg-slate-100 dark:bg-neutral-800")
                      : (userType === "teacher" ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-100 dark:bg-neutral-800")
                  )}>
                    <User className={cn("w-5 h-5", userType === "teacher" ? (isBlock ? "text-amber-300 dark:text-slate-900" : "text-white") : "text-gray-500")} />
                  </div>
                  <span className={cn(isBlock ? "font-black text-slate-900 dark:text-white uppercase tracking-tight" : "font-semibold text-gray-900 dark:text-white")}>Teacher</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUserType("school")}
                className={cn(
                  "p-4 transition-all outline-none",
                  isBlock
                    ? cn(
                      "border-4 rounded-xl font-bold",
                      userType === "school"
                        ? "bg-amber-300 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                        : "bg-white border-transparent shadow-none hover:border-slate-300 dark:bg-neutral-900"
                    )
                    : cn(
                      "border-2 rounded-xl",
                      userType === "school"
                        ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700"
                    )
                )}
              >
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-2",
                    isBlock
                      ? (userType === "school" ? "bg-slate-900 dark:bg-white" : "bg-slate-100 dark:bg-neutral-800")
                      : (userType === "school" ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-100 dark:bg-neutral-800")
                  )}>
                    <Building className={cn("w-5 h-5", userType === "school" ? (isBlock ? "text-amber-300 dark:text-slate-900" : "text-white") : "text-gray-500")} />
                  </div>
                  <span className={cn(isBlock ? "font-black text-slate-900 dark:text-white uppercase tracking-tight" : "font-semibold text-gray-900 dark:text-white")}>School</span>
                </div>
              </button>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div variants={itemVariants} className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className={cn("block text-sm mb-2", isBlock ? "font-black uppercase tracking-wide text-slate-900 dark:text-gray-200" : "font-semibold text-gray-900 dark:text-gray-200")}>
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className={cn("h-5 w-5", isBlock ? "text-slate-900" : "text-gray-400")} />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={loading}
                      className={cn(
                        "w-full pl-10 pr-3 py-3.5 transition disabled:opacity-50",
                        isBlock
                          ? "bg-white dark:bg-neutral-900 border-4 border-slate-900 rounded-xl font-bold text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:translate-y-[2px] focus:shadow-none focus:outline-none"
                          : "border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-white bg-white dark:bg-neutral-900"
                      )}
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className={cn("block text-sm mb-2", isBlock ? "font-black uppercase tracking-wide text-slate-900 dark:text-gray-200" : "font-semibold text-gray-900 dark:text-gray-200")}>
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className={cn("h-5 w-5", isBlock ? "text-slate-900" : "text-gray-400")} />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={loading}
                      className={cn(
                        "w-full pl-10 pr-3 py-3.5 transition disabled:opacity-50",
                        isBlock
                          ? "bg-white dark:bg-neutral-900 border-4 border-slate-900 rounded-xl font-bold text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:translate-y-[2px] focus:shadow-none focus:outline-none"
                          : "border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-white bg-white dark:bg-neutral-900"
                      )}
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="email" className={cn("block text-sm mb-2", isBlock ? "font-black uppercase tracking-wide text-slate-900 dark:text-gray-200" : "font-semibold text-gray-900 dark:text-gray-200")}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                        ? "bg-white dark:bg-neutral-900 border-4 border-slate-900 rounded-xl font-bold text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:translate-y-[2px] focus:shadow-none focus:outline-none"
                        : "border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-white bg-white dark:bg-neutral-900"
                    )}
                    placeholder="you@example.com"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="phone" className={cn("block text-sm mb-2", isBlock ? "font-black uppercase tracking-wide text-slate-900 dark:text-gray-200" : "font-semibold text-gray-900 dark:text-gray-200")}>
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className={cn("h-5 w-5", isBlock ? "text-slate-900" : "text-gray-400")} />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    className={cn(
                      "w-full pl-11 pr-4 py-3.5 transition disabled:opacity-50",
                      isBlock
                        ? "bg-white dark:bg-neutral-900 border-4 border-slate-900 rounded-xl font-bold text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:translate-y-[2px] focus:shadow-none focus:outline-none"
                        : "border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-white bg-white dark:bg-neutral-900"
                    )}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </motion.div>

              {userType === "school" && (
                <motion.div variants={itemVariants}>
                  <label htmlFor="instituteName" className={cn("block text-sm mb-2", isBlock ? "font-black uppercase tracking-wide text-slate-900 dark:text-gray-200" : "font-semibold text-gray-900 dark:text-gray-200")}>
                    School/College Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className={cn("h-5 w-5", isBlock ? "text-slate-900" : "text-gray-400")} />
                    </div>
                    <input
                      type="text"
                      id="instituteName"
                      required
                      value={formData.instituteName}
                      onChange={handleChange}
                      disabled={loading}
                      className={cn(
                        "w-full pl-11 pr-4 py-3.5 transition disabled:opacity-50",
                        isBlock
                          ? "bg-white dark:bg-neutral-900 border-4 border-slate-900 rounded-xl font-bold text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:translate-y-[2px] focus:shadow-none focus:outline-none"
                          : "border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-white bg-white dark:bg-neutral-900"
                      )}
                      placeholder="e.g. Oxford University"
                    />
                  </div>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <label htmlFor="password" className={cn("block text-sm mb-2", isBlock ? "font-black uppercase tracking-wide text-slate-900 dark:text-gray-200" : "font-semibold text-gray-900 dark:text-gray-200")}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                        ? "bg-white dark:bg-neutral-900 border-4 border-slate-900 rounded-xl font-bold text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:translate-y-[2px] focus:shadow-none focus:outline-none"
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

              <div className="flex items-start pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className={cn(
                    "w-5 h-5 mt-0.5 transition-all text-blue-600 outline-none focus:ring-0",
                    isBlock
                      ? "border-2 border-slate-900 rounded-md bg-white checked:bg-amber-400 checked:border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                      : "border-gray-300 rounded focus:ring-gray-900"
                  )}
                />
                <label htmlFor="terms" className={cn("ml-3 text-sm transition-colors", isBlock ? "font-bold text-slate-800 dark:text-gray-300" : "text-gray-600 dark:text-gray-400")}>
                  I agree to the{" "}
                  <Link to="#" className={cn("hover:underline", isBlock ? "font-black text-slate-900 dark:text-white uppercase" : "text-gray-900 dark:text-white font-medium")}>Terms</Link>
                  {" "}and{" "}
                  <Link to="#" className={cn("hover:underline", isBlock ? "font-black text-slate-900 dark:text-white uppercase" : "text-gray-900 dark:text-white font-medium")}>Privacy Policy</Link>
                </label>
              </div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full py-4 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group",
                    isBlock
                      ? "bg-amber-300 text-slate-900 border-4 border-slate-900 rounded-xl font-black text-lg uppercase tracking-wider shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                      : "bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-md"
                  )}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>Create Account {isBlock ? <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> : null}</>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Sign In Link */}
            <motion.p variants={itemVariants} className={cn("text-center mt-8 pb-32", isBlock ? "font-bold text-slate-700 dark:text-gray-300" : "text-gray-600 dark:text-gray-400")}>
              Already have an account?{" "}
              <Link to="/login" className={cn("hover:underline", isBlock ? "font-black text-blue-600 dark:text-blue-400 uppercase ml-1" : "text-blue-600 font-semibold")}>
                Sign in
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
