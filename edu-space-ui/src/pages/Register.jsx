import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [userType, setUserType] = useState("teacher");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration submitted for:", userType);
  };

  return (
    <div className="min-h-screen flex">
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">EduSpace</span>
          </Link>

          {/* Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Create Account</h2>
            <p className="text-lg text-gray-600">Choose your account type to get started</p>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setUserType("teacher")}
              className={`p-5 border-2 rounded-xl transition ${
                userType === "teacher"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  userType === "teacher" ? "bg-gray-900" : "bg-gray-100"
                }`}>
                  <svg className={`w-6 h-6 ${userType === "teacher" ? "text-white" : "text-gray-700"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">Teacher</span>
                <span className="text-xs text-gray-500 mt-1">Book spaces</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setUserType("school")}
              className={`p-5 border-2 rounded-xl transition ${
                userType === "school"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  userType === "school" ? "bg-gray-900" : "bg-gray-100"
                }`}>
                  <svg className={`w-6 h-6 ${userType === "school" ? "text-white" : "text-gray-700"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">School</span>
                <span className="text-xs text-gray-500 mt-1">List spaces</span>
              </div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                placeholder="+91 98765 43210"
              />
            </div>

            {userType === "school" && (
              <div>
                <label htmlFor="instituteName" className="block text-sm font-semibold text-gray-900 mb-2">
                  School/College Name
                </label>
                <input
                  type="text"
                  id="instituteName"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  placeholder="ABC Public School"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
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
              <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                I agree to the{" "}
                <Link to="#" className="text-gray-900 hover:underline font-medium">Terms</Link>
                {" "}and{" "}
                <Link to="#" className="text-gray-900 hover:underline font-medium">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition shadow-md"
            >
              Create Account
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center mt-8 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-900 hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
