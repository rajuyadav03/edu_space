import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { persistAuthFromGoogle } = useAuth();
    const [error, setError] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");
        const userStr = searchParams.get("user");
        const errorMsg = searchParams.get("error");

        if (errorMsg) {
            setError(decodeURIComponent(errorMsg));
            return;
        }

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                persistAuthFromGoogle(token, user);

                // Check if user needs to complete profile (no role set)
                if (!user.role) {
                    navigate("/register?completeProfile=true");
                } else if (user.role === "school") {
                    navigate("/school-dashboard");
                } else {
                    navigate("/teacher-dashboard");
                }
            } catch (err) {
                setError("Failed to process Google login. Please try again.");
            }
        } else {
            setError("Invalid callback. Please try signing in again.");
        }
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 px-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Login Failed</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <a
                        href="/login"
                        className="inline-block bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
                    >
                        Back to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
            <div className="text-center">
                <svg className="animate-spin h-12 w-12 text-gray-900 dark:text-white mx-auto mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">Completing Google sign-in...</p>
            </div>
        </div>
    );
}
