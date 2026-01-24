import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

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
    <div className="min-h-screen flex bg-white dark:bg-neutral-950">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?w=1200"
          alt="College"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-900/30"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white max-w-md">
            <h1 className="text-5xl font-bold mb-6">Join EduSpace Today</h1>
            <p className="text-xl text-gray-200">
              List your spaces or find the perfect venue for your educational needs.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto bg-white dark:bg-neutral-950">
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">EduSpace</span>
          </Link>

          {/* Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Create Account</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Choose your account type to get started</p>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setUserType("teacher")}
              className={`p-5 border-2 rounded-xl transition ${userType === "teacher"
                  ? "border-gray-900 dark:border-gray-400 bg-gray-50 dark:bg-neutral-900"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${userType === "teacher" ? "bg-gray-900 dark:bg-white" : "bg-gray-100 dark:bg-neutral-800"
                  }`}>
                  <svg className={`w-6 h-6 ${userType === "teacher" ? "text-white dark:text-gray-900" : "text-gray-700 dark:text-gray-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">Teacher</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Book spaces</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setUserType("school")}
              className={`p-5 border-2 rounded-xl transition ${userType === "school"
                  ? "border-gray-900 dark:border-gray-400 bg-gray-50 dark:bg-neutral-900"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${userType === "school" ? "bg-gray-900 dark:bg-white" : "bg-gray-100 dark:bg-gray-700"
                  }`}>
                  <svg className={`w-6 h-6 ${userType === "school" ? "text-white dark:text-gray-900" : "text-gray-700 dark:text-gray-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">School</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">List spaces</span>
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
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 dark:focus:border-gray-400 transition text-gray-900 dark:text-white bg-white dark:bg-neutral-900 disabled:opacity-50"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 dark:focus:border-gray-400 transition text-gray-900 dark:text-white bg-white dark:bg-neutral-900 disabled:opacity-50"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 dark:focus:border-gray-400 transition text-gray-900 dark:text-white bg-white dark:bg-neutral-900 disabled:opacity-50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 dark:focus:border-gray-400 transition text-gray-900 dark:text-white bg-white dark:bg-neutral-900 disabled:opacity-50"
                placeholder="+91 98765 43210"
              />
            </div>

            {userType === "school" && (
              <div>
                <label htmlFor="instituteName" className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2">
                  School/College Name
                </label>
                <input
                  type="text"
                  id="instituteName"
                  required
                  value={formData.instituteName}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 dark:focus:border-gray-400 transition text-gray-900 dark:text-white bg-white dark:bg-neutral-900 disabled:opacity-50"
                  placeholder="ABC Public School"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 dark:focus:border-gray-400 transition text-gray-900 dark:text-white bg-white dark:bg-neutral-900 disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 mt-1 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                I agree to the{" "}
                <Link to="#" className="text-gray-900 dark:text-white hover:underline font-medium">Terms</Link>
                {" "}and{" "}
                <Link to="#" className="text-gray-900 dark:text-white hover:underline font-medium">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          <p className="text-center mt-8 text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-900 dark:text-white hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
