import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Listings from "./pages/Listings";
import ListingDetails from "./pages/ListingDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherDashboard from "./pages/TeacherDashboard";
import SchoolDashboard from "./pages/SchoolDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/school-dashboard" element={<SchoolDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
