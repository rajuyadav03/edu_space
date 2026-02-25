import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { bookingsAPI, favoritesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

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
      setActionError("");
      await bookingsAPI.cancel(bookingId);
      setBookings(bookings.filter(b => (b._id || b.id) !== bookingId));
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      setActionError("Failed to cancel booking. Please try again.");
      // Auto-clear error after 5 seconds
      setTimeout(() => setActionError(""), 5000);
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
        <div className="min-h-screen flex items-center justify-center pt-20 bg-gray-50 dark:bg-neutral-950">
          <svg className="animate-spin h-12 w-12 text-gray-900 dark:text-white" viewBox="0 0 24 24">
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

      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Manage your bookings and profile</p>
          </div>

          {/* Action Error Toast */}
          {actionError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {actionError}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.confirmed}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Confirmed</div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.pending}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">₹{stats.totalSpent.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
            <div className="border-b border-gray-200 dark:border-neutral-800 px-6">
              <div className="flex gap-8">
                <button
                  type="button"
                  onClick={() => setActiveTab("bookings")}
                  className={`py-4 border-b-2 font-semibold transition ${activeTab === "bookings"
                    ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  My Bookings
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("favorites")}
                  className={`py-4 border-b-2 font-medium transition ${activeTab === "favorites"
                    ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  Favorites
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`py-4 border-b-2 font-medium transition ${activeTab === "profile"
                    ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  Profile
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "bookings" && (
                <>
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
                        <div key={booking._id || booking.id} className="bg-gray-50 dark:bg-neutral-900/50 rounded-2xl p-6 flex gap-6 hover:bg-gray-100 dark:hover:bg-neutral-900 transition">
                          <img
                            src={booking.listing?.image || booking.image || "https://images.unsplash.com/photo-1588072432836-e10032774350?w=400"}
                            alt={booking.listing?.name || booking.spaceName}
                            className="w-32 h-32 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                  {booking.listing?.name || booking.spaceName}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {booking.listing?.location || booking.location}
                                </p>
                              </div>
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${booking.status === 'confirmed' || booking.status === 'Confirmed'
                                ? 'bg-green-100 text-green-700'
                                : booking.status === 'rejected' || booking.status === 'Rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
                              </span>
                            </div>

                            <div className="flex items-center gap-6 mb-4">
                              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium">{new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">{booking.duration === 'full' ? 'Full Day' : 'Half Day'}</span>
                              </div>
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                ₹{booking.price || booking.listing?.price || 0}
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <Link
                                to={`/listing/${booking.listing?._id || booking.listing}`}
                                className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition"
                              >
                                View Details
                              </Link>
                              {(booking.status === 'pending' || booking.status === 'Pending') && (
                                <button
                                  type="button"
                                  onClick={() => handleCancelBooking(booking._id || booking.id)}
                                  disabled={cancellingId === (booking._id || booking.id)}
                                  className="px-6 py-2 border-2 border-gray-900 dark:border-gray-300 text-gray-900 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-neutral-800 transition disabled:opacity-50"
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
                      className="inline-flex items-center gap-2 text-gray-900 dark:text-white font-semibold hover:gap-3 transition-all"
                    >
                      Browse more spaces
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </>
              )}

              {/* Favorites Tab */}
              {activeTab === "favorites" && (
                <FavoritesTab
                  favorites={favorites}
                  setFavorites={setFavorites}
                  favLoading={favLoading}
                  setFavLoading={setFavLoading}
                  isAuthenticated={isAuthenticated}
                />
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="max-w-lg mx-auto">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || 'T'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || 'Teacher'}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{user?.email || 'teacher@example.com'}</p>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <p className="text-gray-900 dark:text-white font-medium">{user?.name || 'Not set'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <p className="text-gray-900 dark:text-white font-medium">{user?.email || 'Not set'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                      <p className="text-gray-900 dark:text-white font-medium">{user?.phone || 'Not set'}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                  >
                    Edit Profile
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

// Favorites Tab Component
function FavoritesTab({ favorites, setFavorites, favLoading, setFavLoading, isAuthenticated }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || loaded) return;

    const fetchFavorites = async () => {
      try {
        setFavLoading(true);
        const res = await favoritesAPI.getAll();
        const favs = res.data?.favorites || res.data || [];
        setFavorites(favs);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      } finally {
        setFavLoading(false);
        setLoaded(true);
      }
    };
    fetchFavorites();
  }, [isAuthenticated, loaded, setFavorites, setFavLoading]);

  const handleRemoveFavorite = async (listingId) => {
    try {
      await favoritesAPI.remove(listingId);
      setFavorites(favorites.filter(f => (f._id || f.id) !== listingId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  if (favLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse bg-gray-50 dark:bg-neutral-800 rounded-2xl overflow-hidden">
            <div className="aspect-[4/3] bg-gray-200 dark:bg-neutral-700" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2" />
              <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No favorites yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Save your favorite spaces by clicking the heart icon on any listing</p>
        <Link to="/listings" className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition inline-block">
          Browse Spaces
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((listing) => (
        <div key={listing._id || listing.id} className="bg-gray-50 dark:bg-neutral-900/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-neutral-800 hover:shadow-lg transition group">
          <Link to={`/listing/${listing._id || listing.id}`} className="block">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={listing.images?.[0] || listing.image || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"}
                alt={listing.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"; }}
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 dark:bg-neutral-900/90 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300">
                {listing.spaceType}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{listing.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">{listing.location}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900 dark:text-white">₹{listing.price}<span className="text-sm font-normal text-gray-500">/day</span></span>
              </div>
            </div>
          </Link>
          <div className="px-5 pb-4">
            <button
              onClick={() => handleRemoveFavorite(listing._id || listing.id)}
              className="w-full py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Remove from Favorites
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
