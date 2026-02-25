import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "./pages/home";
import Listings from "./pages/Listings";
import ListingDetails from "./pages/ListingDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import GoogleCallback from "./pages/GoogleCallback";
import NotFound from "./pages/NotFound";
import EduSpaceLoader from "./components/EduSpaceLoader";

// Lazy load pages for better initial page load
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const SchoolDashboard = lazy(() => import("./pages/SchoolDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));



export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<EduSpaceLoader message="Preparing your space" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/school-dashboard" element={<SchoolDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
