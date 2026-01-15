import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import AddSpaceModal from "../components/AddSpaceModal";
import { listingsAPI, bookingsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function SchoolDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [mySpaces, setMySpaces] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [isAddSpaceModalOpen, setIsAddSpaceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("spaces");

  // Redirect if not authenticated or not a school
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "school")) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, user, navigate]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || user?.role !== "school") return;
      
      try {
        setLoading(true);
        const [listingsRes, requestsRes] = await Promise.all([
          listingsAPI.getMyListings(),
          bookingsAPI.getRequests()
        ]);
        setMySpaces(listingsRes.data.listings || listingsRes.data || []);
        setPendingRequests(requestsRes.data.bookings || requestsRes.data || []);
        setError("");
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !authLoading) {
      fetchData();
    }
  }, [isAuthenticated, authLoading, user]);

  const handleBookingAction = async (bookingId, status) => {
    try {
      setActionLoading(bookingId);
      setActionError("");
      await bookingsAPI.updateStatus(bookingId, status);
      setPendingRequests(prev => prev.filter(r => (r._id || r.id) !== bookingId));
    } catch (err) {
      console.error(`Failed to ${status} booking:`, err);
      setActionError(`Failed to ${status} booking. Please try again.`);
      setTimeout(() => setActionError(""), 5000);
    } finally {
      setActionLoading(null);
    }
  };

  // Calculate stats
  const stats = {
    listedSpaces: mySpaces.length,
    totalBookings: mySpaces.reduce((sum, s) => sum + (s.bookings || 0), 0),
    pendingCount: pendingRequests.filter(r => r.status === 'pending' || r.status === 'Pending').length,
    totalRevenue: mySpaces.reduce((sum, s) => sum + (s.revenue || 0), 0)
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20 bg-gray-50 dark:bg-gray-900">
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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">School Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Manage your spaces and booking requests</p>
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.listedSpaces}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Listed Spaces</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalBookings}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.pendingCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending Requests</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">₹{stats.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6">
              <div className="flex gap-8">
                <button 
                  type="button" 
                  onClick={() => setActiveTab("spaces")}
                  className={`py-4 border-b-2 font-semibold transition ${
                    activeTab === "spaces" 
                      ? "border-gray-900 dark:border-white text-gray-900 dark:text-white" 
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  My Spaces
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab("requests")}
                  className={`py-4 border-b-2 font-medium transition ${
                    activeTab === "requests" 
                      ? "border-gray-900 dark:border-white text-gray-900 dark:text-white" 
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Booking Requests
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab("analytics")}
                  className={`py-4 border-b-2 font-medium transition ${
                    activeTab === "analytics" 
                      ? "border-gray-900 dark:border-white text-gray-900 dark:text-white" 
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Analytics
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab("settings")}
                  className={`py-4 border-b-2 font-medium transition ${
                    activeTab === "settings" 
                      ? "border-gray-900 dark:border-white text-gray-900 dark:text-white" 
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Settings
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* My Spaces Tab */}
              {activeTab === "spaces" && (
                <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Listed Spaces</h2>
                <button 
                  type="button"
                  onClick={() => setIsAddSpaceModalOpen(true)}
                  className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Space
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mySpaces.map((space) => (
                  <div key={space._id || space.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <img 
                      src={space.image} 
                      alt={space.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{space.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400">{space.type} • {space.capacity} people</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                          {space.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-gray-200 dark:border-gray-700">
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price/Day</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">₹{space.price}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bookings</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{space.bookings}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Revenue</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">₹{space.revenue}</div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          type="button" 
                          onClick={() => {
                            // TODO: Implement edit modal
                            alert('Edit functionality coming soon! For now, please delete and recreate the listing.');
                          }}
                          className="flex-1 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition"
                        >
                          Edit
                        </button>
                        <button 
                          type="button" 
                          onClick={() => navigate(`/listings/${space._id || space.id}`)}
                          className="flex-1 px-4 py-2 border-2 border-gray-900 dark:border-gray-300 text-gray-900 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          View
                        </button>
                        <button 
                          type="button" 
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to delete "${space.name}"? This action cannot be undone.`)) {
                              try {
                                setActionLoading(space._id || space.id);
                                await listingsAPI.remove(space._id || space.id);
                                setMySpaces(prev => prev.filter(s => (s._id || s.id) !== (space._id || space.id)));
                              } catch (err) {
                                console.error('Failed to delete listing:', err);
                                setActionError('Failed to delete listing. Please try again.');
                                setTimeout(() => setActionError(''), 5000);
                              } finally {
                                setActionLoading(null);
                              }
                            }
                          }}
                          disabled={actionLoading === (space._id || space.id)}
                          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl hover:border-red-300 hover:text-red-600 dark:hover:border-red-500 dark:hover:text-red-400 transition disabled:opacity-50"
                        >
                          {actionLoading === (space._id || space.id) ? (
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                </>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600 dark:text-gray-400">Detailed analytics and insights about your spaces will be available here.</p>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="max-w-lg mx-auto">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School Name</label>
                      <p className="text-gray-900 dark:text-white font-medium">{user?.schoolName || user?.name || 'Not set'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <p className="text-gray-900 dark:text-white font-medium">{user?.email || 'Not set'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                      <p className="text-gray-900 dark:text-white font-medium">{user?.phone || 'Not set'}</p>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    Settings editing will be available when backend is connected
                  </p>
                </div>
              )}

              {/* Requests Tab - Show pending requests inline */}
              {activeTab === "requests" && (
                <>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2].map((n) => (
                        <div key={n} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 animate-pulse">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                            <div className="flex-1 space-y-2">
                              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : pendingRequests.filter(r => r.status === 'pending' || r.status === 'Pending').length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xl text-gray-500 dark:text-gray-400">No pending requests</p>
                    </div>
                  ) : (
                <div className="space-y-4">
                  {pendingRequests.filter(r => r.status === 'pending' || r.status === 'Pending').map((request) => (
                    <div key={request._id || request.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-gray-900 font-bold">
                            {(request.teacher?.name || request.teacher || 'T').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{request.teacher?.name || request.teacher}</h3>
                            <p className="text-gray-600 dark:text-gray-400">Requested {request.listing?.name || request.space}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">{new Date(request.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{request.duration === 'full' ? 'Full Day' : 'Half Day'}</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            ₹{request.price || request.listing?.price || 0}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleBookingAction(request._id || request.id, 'confirmed')}
                          disabled={actionLoading === (request._id || request.id)}
                          className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition flex items-center gap-2 disabled:opacity-50"
                        >
                          {actionLoading === (request._id || request.id) ? (
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          Approve
                        </button>
                        <button 
                          onClick={() => handleBookingAction(request._id || request.id, 'rejected')}
                          disabled={actionLoading === (request._id || request.id)}
                          className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 dark:hover:border-red-500 dark:hover:text-red-400 transition flex items-center gap-2 disabled:opacity-50"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Space Modal */}
      <AddSpaceModal 
        isOpen={isAddSpaceModalOpen}
        onClose={() => setIsAddSpaceModalOpen(false)}
        onSuccess={async () => {
          // Refresh listings after adding
          try {
            const res = await listingsAPI.getMyListings();
            setMySpaces(res.data.listings || res.data || []);
          } catch (err) {
            console.error("Failed to refresh listings:", err);
          }
        }}
      />

      <Footer />
    </>
  );
}

