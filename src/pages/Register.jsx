import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { cn } from "../lib/utils";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { isBlock } = useTheme();

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
    <div className={cn("min-h-screen flex", isBlock ? "bg-[#FFFBEB] dark:bg-neutral-950" : "bg-white dark:bg-neutral-950")}>
      {/* Left Side - Image */}
      <div className={cn(
        "hidden lg:block lg:w-1/2 relative",
        isBlock ? "border-r-4 border-slate-900" : ""
      )}>
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?w=1200"
          alt="College"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-900/30"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className={cn("text-white max-w-md", isBlock ? "bg-amber-400 border-4 border-slate-900 p-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]" : "")}>
            <h1 className={cn("text-5xl mb-6", isBlock ? "font-black text-slate-900 uppercase tracking-tight" : "font-bold")}>Join EduSpace Today</h1>
            <p className={cn("text-xl", isBlock ? "font-bold text-slate-800" : "text-gray-200")}>
              List your spaces or find the perfect venue for your educational needs.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className={cn("w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto", isBlock ? "bg-[#FFFBEB] dark:bg-neutral-950" : "bg-white dark:bg-neutral-950")}>
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className={cn("w-12 h-12 flex items-center justify-center", isBlock ? "bg-amber-300 border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]" : "bg-gray-900 rounded-xl")}>
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

          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setUserType("teacher")}
              className={cn(
                "p-5 transition-all outline-none",
                isBlock
                  ? cn(
                    "border-4 rounded-xl font-bold",
                    userType === "teacher"
                      ? "bg-amber-300 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                      : "bg-white border-transparent shadow-none hover:border-slate-300"
                  )
                  : cn(
                    "border-2 rounded-xl",
                    userType === "teacher"
                      ? "border-gray-900 dark:border-gray-400 bg-gray-50 dark:bg-neutral-900"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  )
              )}
            >
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                  isBlock
                    ? (userType === "teacher" ? "bg-slate-900 dark:bg-white" : "bg-slate-100 dark:bg-neutral-800")
                    : (userType === "teacher" ? "bg-gray-900 dark:bg-white" : "bg-gray-100 dark:bg-neutral-800")
                )}>
                  <svg className={cn("w-6 h-6", userType === "teacher" ? (isBlock ? "text-amber-300 dark:text-slate-900" : "text-white dark:text-gray-900") : "text-gray-700 dark:text-gray-300")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className={cn(isBlock ? "font-black text-slate-900 dark:text-white uppercase tracking-tight" : "font-semibold text-gray-900 dark:text-white")}>Teacher</span>
                <span className={cn("text-xs mt-1", isBlock ? "font-bold text-slate-600 dark:text-gray-400" : "text-gray-500 dark:text-gray-400")}>Book spaces</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setUserType("school")}
              className={cn(
                "p-5 transition-all outline-none",
                isBlock
                  ? cn(
                    "border-4 rounded-xl font-bold",
                    userType === "school"
                      ? "bg-amber-300 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                      : "bg-white border-transparent shadow-none hover:border-slate-300"
                  )
                  : cn(
                    "border-2 rounded-xl",
                    userType === "school"
                      ? "border-gray-900 dark:border-gray-400 bg-gray-50 dark:bg-neutral-900"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  )
              )}
            >
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                  isBlock
                    ? (userType === "school" ? "bg-slate-900 dark:bg-white" : "bg-slate-100 dark:bg-neutral-800")
                    : (userType === "school" ? "bg-gray-900 dark:bg-white" : "bg-gray-100 dark:bg-gray-700")
                )}>
                  <svg className={cn("w-6 h-6", userType === "school" ? (isBlock ? "text-amber-300 dark:text-slate-900" : "text-white dark:text-gray-900") : "text-gray-700 dark:text-gray-300")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className={cn(isBlock ? "font-black text-slate-900 dark:text-white uppercase tracking-tight" : "font-semibold text-gray-900 dark:text-white")}>School</span>
                <span className={cn("text-xs mt-1", isBlock ? "font-bold text-slate-600 dark:text-gray-400" : "text-gray-500 dark:text-gray-400")}>List spaces</span>
              </div>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={cn("block text-sm mb-2", isBlock ? "font-black uppercase tracking-wide text-slate-900 dark:text-gray-200" : "font-semibold text-gray-900 dark:text-gray-200")}>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading}
                  className={cn(
                    "w-full px-4 py-3 transition disabled:opacity-50",
                    isBlock
                      ? "bg-white dark:bg-neutral-900 border-4 border-slate-900 rounded-xl font-bold text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:translate-y-[2px] focus:shadow-none focus:outline-none"
                      : "border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 dark:focus:border-gray-400 text-gray-900 dark:text-white bg-white dark:bg-neutral-900"
                  )}
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className={cn("block text-sm mb-2", isBlock ? "font-black uppercase tracking-wide text-slate-900 dark:text-gray-200" : "font-semibold text-gray-900 dark:text-gray-200")}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={loading}
                  className={cn(
                    "w-full px-4 py-3 transition disabled:opacity-50",
                    isBlock
                      ? "bg-white dark:bg-neutral-900 border-4 border-slate-900 rounded-xl font-bold text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:translate-y-[2px] focus:shadow-none focus:outline-none"
                      : "border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 dark:focus:border-gray-400 text-gray-900 dark:text-white bg-white dark:bg-neutral-900"
                  )}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={cn("block text-sm mb-2", isBlock ? "font-black uppercase tracking-wide text-slate-900 dark:text-gray-200" : "font-semibold text-gray-900 dark:text-gray-200")}>
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className={cn(
                  "w-full px-4 py-3 transition disabled:opacity-50",
                  isBlock
                    ? "bg-white dark:bg-neutral-900 border-4 border-slate-900 rounded-xl font-bold text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:translate-y-[2px] focus:shadow-none focus:outline-none"
                    : "border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 dark:focus:border-gray-400 text-gray-900 dark:text-white bg-white dark:bg-neutral-900"
                )}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className={cn("block text-sm mb-2", isBlock ? "font-black uppercase tracking-wide text-slate-900 dark:text-gray-200" : "font-semibold text-gray-900 dark:text-gray-200")}>
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className={cn(
                  "w-full px-4 py-3 transition disabled:opacity-50",
                  isBlock
                    ? "bg-white dark:bg-neutral-900 border-4 border-slate-900 rounded-xl font-bold text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:translate-y-[2px] focus:shadow-none focus:outline-none"
                    : "border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 dark:focus:border-gray-400 text-gray-900 dark:text-white bg-white dark:bg-neutral-900"
                )}
                placeholder="+91 98765 43210"
              />
            </div>

            {userType === "school" && (
              <div>
                <label htmlFor="instituteName" className={cn("block text-sm mb-2", isBlock ? "font-black uppercase tracking-wide text-slate-900 dark:text-gray-200" : "font-semibold text-gray-900 dark:text-gray-200")}>
                  School/College Name
                </label>
                <input
                  type="text"
                  id="instituteName"
                  required
                  value={formData.instituteName}
                  onChange={handleChange}
                  disabled={loading}
                  className={cn(
                    "w-full px-4 py-3 transition disabled:opacity-50",
                    isBlock
                      ? "bg-white dark:bg-neutral-900 border-4 border-slate-900 rounded-xl font-bold text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:translate-y-[2px] focus:shadow-none focus:outline-none"
                      : "border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 dark:focus:border-gray-400 text-gray-900 dark:text-white bg-white dark:bg-neutral-900"
                  )}
                  placeholder="ABC Public School"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className={cn("block text-sm mb-2", isBlock ? "font-black uppercase tracking-wide text-slate-900 dark:text-gray-200" : "font-semibold text-gray-900 dark:text-gray-200")}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={cn(
                    "w-full px-4 py-3 pr-12 transition disabled:opacity-50",
                    isBlock
                      ? "bg-white dark:bg-neutral-900 border-4 border-slate-900 rounded-xl font-bold text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:translate-y-[2px] focus:shadow-none focus:outline-none"
                      : "border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 dark:focus:border-gray-400 text-gray-900 dark:text-white bg-white dark:bg-neutral-900"
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

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

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-4 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                isBlock
                  ? "bg-amber-300 text-slate-900 border-4 border-slate-900 rounded-xl font-black text-lg uppercase tracking-wider shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                  : "bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 shadow-md"
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
                "Create Account"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className={cn("text-center mt-8", isBlock ? "font-bold text-slate-700 dark:text-gray-300" : "text-gray-600 dark:text-gray-400")}>
            Already have an account?{" "}
            <Link to="/login" className={cn("hover:underline", isBlock ? "font-black text-blue-600 dark:text-blue-400 uppercase ml-1" : "text-gray-900 dark:text-white font-semibold")}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
