import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EduSpaceLoader from "./EduSpaceLoader";

/**
 * ProtectedRoute — wraps pages that require authentication.
 * - Shows a loader while AuthContext is still validating the stored token.
 * - Redirects to /login only AFTER auth has finished loading and user is not authenticated.
 * - Optionally checks for a specific role ("admin", "teacher", "school").
 */
export default function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, loading, user } = useAuth();

    // Auth is still booting — show loader, do NOT redirect yet
    if (loading) {
        return <EduSpaceLoader message="Verifying your session..." />;
    }

    // Auth finished and user is not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Optional role check
    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
