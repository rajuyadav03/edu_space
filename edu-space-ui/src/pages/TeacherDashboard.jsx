import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { bookingsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  // Redirect if not authenticated or not a teacher
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "teacher")) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, user, navigate]);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated || user?.role !== "teacher") return;
      
      try {
        setLoading(true);
        const response = await bookingsAPI.getMyBookings();
        setBookings(response.data.bookings || response.data || []);
        setError("");
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !authLoading) {
      fetchBookings();
    }
  }, [isAuthenticated, authLoading, user]);

  const handleCancelBooking = async (bookingId) => {
    try {
      setCancellingId(bookingId);
      await bookingsAPI.cancel(bookingId);
      setBookings(bookings.filter(b => (b._id || b.id) !== bookingId));
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  // Calculate stats
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "confirmed" || b.status === "Confirmed").length,
    pending: bookings.filter(b => b.status === "pending" || b.status === "Pending").length,
    totalSpent: bookings.reduce((sum, b) => sum + (b.price || b.listing?.price || 0), 0)
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20 bg-gray-50">
          <svg className="animate-spin h-12 w-12 text-gray-900" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
            <p className="text-lg text-gray-600">Manage your bookings and profile</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.confirmed}</div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">₹{stats.totalSpent.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6">
              <div className="flex gap-8">
                <button className="py-4 border-b-2 border-gray-900 font-semibold text-gray-900">
                  My Bookings
                </button>
                <button className="py-4 border-b-2 border-transparent font-medium text-gray-600 hover:text-gray-900">
                  Favorites
                </button>
                <button className="py-4 border-b-2 border-transparent font-medium text-gray-600 hover:text-gray-900">
                  Profile
                </button>
              </div>
            </div>

            {/* Bookings List */}
            <div className="p-6">
              {loading ? (
                // Loading skeleton
                <div className="space-y-6">
                  {[1, 2].map((n) => (
                    <div key={n} className="bg-gray-50 rounded-2xl p-6 flex gap-6 animate-pulse">
                      <div className="w-32 h-32 bg-gray-200 rounded-xl" />
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold"
                  >
                    Try Again
                  </button>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xl text-gray-500 mb-4">No bookings yet</p>
                  <Link to="/listings" className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold inline-block">
                    Browse Spaces
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div key={booking._id || booking.id} className="bg-gray-50 rounded-2xl p-6 flex gap-6 hover:bg-gray-100 transition">
                      <img 
                        src={booking.listing?.image || booking.image || "https://images.unsplash.com/photo-1588072432836-e10032774350?w=400"} 
                        alt={booking.listing?.name || booking.spaceName}
                        className="w-32 h-32 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {booking.listing?.name || booking.spaceName}
                            </h3>
                            <p className="text-gray-600 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {booking.listing?.location || booking.location}
                            </p>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            booking.status === 'confirmed' || booking.status === 'Confirmed'
                              ? 'bg-green-100 text-green-700' 
                              : booking.status === 'rejected' || booking.status === 'Rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                          </span>
                        </div>

                        <div className="flex items-center gap-6 mb-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">{new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{booking.duration === 'full' ? 'Full Day' : 'Half Day'}</span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            ₹{booking.price || booking.listing?.price || 0}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Link 
                            to={`/listing/${booking.listing?._id || booking.listing}`}
                            className="px-6 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition"
                          >
                            View Details
                          </Link>
                          {(booking.status === 'pending' || booking.status === 'Pending') && (
                            <button 
                              onClick={() => handleCancelBooking(booking._id || booking.id)}
                              disabled={cancellingId === (booking._id || booking.id)}
                              className="px-6 py-2 border-2 border-gray-900 text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                            >
                              {cancellingId === (booking._id || booking.id) ? 'Cancelling...' : 'Cancel Booking'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Browse More */}
              <div className="mt-8 text-center">
                <Link 
                  to="/listings"
                  className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all"
                >
                  Browse more spaces
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
