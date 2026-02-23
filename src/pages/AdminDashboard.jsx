import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { adminAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard, Users, Building2, CalendarCheck,
    Search, Trash2, ChevronDown, TrendingUp, IndianRupee,
    AlertCircle, RefreshCw, Shield
} from "lucide-react";

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Data states
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [listings, setListings] = useState([]);
    const [bookings, setBookings] = useState([]);

    // Filter/search states
    const [userSearch, setUserSearch] = useState("");
    const [userRoleFilter, setUserRoleFilter] = useState("all");
    const [listingSearch, setListingSearch] = useState("");
    const [bookingSearch, setBookingSearch] = useState("");
    const [bookingStatusFilter, setBookingStatusFilter] = useState("all");

    const [actionLoading, setActionLoading] = useState(null);

    // Use refs so fetchTabData doesn't re-create on every keystroke
    const filtersRef = useRef({ userSearch, userRoleFilter, listingSearch, bookingSearch, bookingStatusFilter });
    filtersRef.current = { userSearch, userRoleFilter, listingSearch, bookingSearch, bookingStatusFilter };

    // Auth guard
    useEffect(() => {
        if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
            navigate("/login");
        }
    }, [isAuthenticated, authLoading, user, navigate]);

    // Fetch data based on active tab (stable — doesn't depend on search/filter values)
    const fetchTabData = useCallback(async () => {
        if (!isAuthenticated || user?.role !== "admin") return;
        const f = filtersRef.current;
        try {
            setLoading(true);
            setError("");

            if (activeTab === "overview") {
                const res = await adminAPI.getStats();
                setStats(res.data.stats);
                setRecentBookings(res.data.recentBookings || []);
            } else if (activeTab === "users") {
                const res = await adminAPI.getUsers({ search: f.userSearch, role: f.userRoleFilter });
                setUsers(res.data.users || []);
            } else if (activeTab === "listings") {
                const res = await adminAPI.getListings({ search: f.listingSearch });
                setListings(res.data.listings || []);
            } else if (activeTab === "bookings") {
                const res = await adminAPI.getBookings({ search: f.bookingSearch, status: f.bookingStatusFilter });
                setBookings(res.data.bookings || []);
            }
        } catch (err) {
            console.error("Admin fetch error:", err);
            setError("Failed to load data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [activeTab, isAuthenticated, user]);

    // Fetch on tab change or initial load
    useEffect(() => {
        if (isAuthenticated && !authLoading && user?.role === "admin") {
            fetchTabData();
        }
    }, [fetchTabData, isAuthenticated, authLoading]);

    // Debounced search — waits 500ms after last keystroke before fetching
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAuthenticated && !authLoading && user?.role === "admin") {
                fetchTabData();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [userSearch, userRoleFilter, listingSearch, bookingSearch, bookingStatusFilter]);

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    // Actions
    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Delete user "${name}" and all their data? This cannot be undone.`)) return;
        try {
            setActionLoading(id);
            await adminAPI.deleteUser(id);
            setUsers(prev => prev.filter(u => u._id !== id));
            showSuccess(`User "${name}" deleted successfully`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete user");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteListing = async (id, name) => {
        if (!window.confirm(`Delete listing "${name}"? Associated bookings will also be removed.`)) return;
        try {
            setActionLoading(id);
            await adminAPI.deleteListing(id);
            setListings(prev => prev.filter(l => l._id !== id));
            showSuccess(`Listing "${name}" deleted`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete listing");
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdateBookingStatus = async (id, status) => {
        try {
            setActionLoading(id);
            await adminAPI.updateBookingStatus(id, status);
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
            showSuccess(`Booking status updated to "${status}"`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update booking");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!window.confirm("Delete this booking permanently?")) return;
        try {
            setActionLoading(id);
            await adminAPI.deleteBooking(id);
            setBookings(prev => prev.filter(b => b._id !== id));
            showSuccess("Booking deleted");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete booking");
        } finally {
            setActionLoading(null);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
            </div>
        );
    }

    const tabs = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "users", label: "Users", icon: Users },
        { id: "listings", label: "Listings", icon: Building2 },
        { id: "bookings", label: "Bookings", icon: CalendarCheck }
    ];

    const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const formatCurrency = (n) => `₹${(n || 0).toLocaleString("en-IN")}`;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
            <Navbar />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage everything on the platform</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchTabData}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                        <button onClick={() => setError("")} className="ml-auto text-red-500 hover:text-red-700 text-lg font-bold">&times;</button>
                    </div>
                )}
                {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-sm">
                        ✅ {successMsg}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-1 mb-8 bg-white dark:bg-neutral-900 p-1.5 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && <OverviewTab stats={stats} recentBookings={recentBookings} loading={loading} formatCurrency={formatCurrency} formatDate={formatDate} />}
                {activeTab === "users" && (
                    <UsersTab
                        users={users} loading={loading} search={userSearch} setSearch={setUserSearch}
                        roleFilter={userRoleFilter} setRoleFilter={setUserRoleFilter}
                        onDelete={handleDeleteUser} actionLoading={actionLoading} formatDate={formatDate}
                    />
                )}
                {activeTab === "listings" && (
                    <ListingsTab
                        listings={listings} loading={loading} search={listingSearch} setSearch={setListingSearch}
                        onDelete={handleDeleteListing} actionLoading={actionLoading} formatCurrency={formatCurrency}
                    />
                )}
                {activeTab === "bookings" && (
                    <BookingsTab
                        bookings={bookings} loading={loading}
                        search={bookingSearch} setSearch={setBookingSearch}
                        statusFilter={bookingStatusFilter} setStatusFilter={setBookingStatusFilter}
                        onUpdateStatus={handleUpdateBookingStatus} onDelete={handleDeleteBooking}
                        actionLoading={actionLoading} formatCurrency={formatCurrency} formatDate={formatDate}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
}

/* ============ OVERVIEW TAB ============ */
function OverviewTab({ stats, recentBookings, loading, formatCurrency, formatDate }) {
    if (loading || !stats) {
        return <LoadingSkeleton rows={3} />;
    }

    const statCards = [
        { label: "Total Users", value: stats.totalUsers, icon: Users, gradient: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20" },
        { label: "Schools", value: stats.totalSchools, icon: Building2, gradient: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20" },
        { label: "Teachers", value: stats.totalTeachers, icon: Users, gradient: "from-violet-500 to-purple-500", shadow: "shadow-violet-500/20" },
        { label: "Active Listings", value: stats.activeListings, icon: Building2, gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/20" },
        { label: "Total Bookings", value: stats.totalBookings, icon: CalendarCheck, gradient: "from-rose-500 to-pink-500", shadow: "shadow-rose-500/20" },
        { label: "Pending Bookings", value: stats.pendingBookings, icon: AlertCircle, gradient: "from-yellow-500 to-amber-500", shadow: "shadow-yellow-500/20" },
        { label: "Confirmed", value: stats.confirmedBookings, icon: TrendingUp, gradient: "from-green-500 to-emerald-500", shadow: "shadow-green-500/20" },
        { label: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: IndianRupee, gradient: "from-indigo-500 to-blue-600", shadow: "shadow-indigo-500/20" }
    ];

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <div key={i} className={`relative overflow-hidden bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-5 shadow-lg ${card.shadow} hover:scale-[1.02] transition-transform`}>
                        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.gradient} opacity-10 rounded-bl-[40px]`} />
                        <div className={`w-10 h-10 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                            <card.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Bookings</h3>
                {recentBookings.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">No bookings yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-neutral-800">
                                    <th className="pb-3 font-medium">Listing</th>
                                    <th className="pb-3 font-medium">Teacher</th>
                                    <th className="pb-3 font-medium">Date</th>
                                    <th className="pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-neutral-800">
                                {recentBookings.map(b => (
                                    <tr key={b._id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition">
                                        <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">{b.listing?.name || "—"}</td>
                                        <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{b.teacher?.name || "—"}</td>
                                        <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{formatDate(b.bookingDate)}</td>
                                        <td className="py-3"><StatusBadge status={b.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ============ USERS TAB ============ */
function UsersTab({ users, loading, search, setSearch, roleFilter, setRoleFilter, onDelete, actionLoading, formatDate }) {
    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text" placeholder="Search by name, email, phone..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                    />
                </div>
                <div className="relative">
                    <select
                        value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white cursor-pointer"
                    >
                        <option value="all">All Roles</option>
                        <option value="teacher">Teachers</option>
                        <option value="school">Schools</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden">
                {loading ? <LoadingSkeleton rows={5} /> : users.length === 0 ? (
                    <p className="text-center py-12 text-gray-500 dark:text-gray-400">No users found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800/50">
                                    <th className="px-5 py-3 font-medium">Name</th>
                                    <th className="px-5 py-3 font-medium">Email</th>
                                    <th className="px-5 py-3 font-medium">Role</th>
                                    <th className="px-5 py-3 font-medium">Phone</th>
                                    <th className="px-5 py-3 font-medium">Joined</th>
                                    <th className="px-5 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-neutral-800">
                                {users.map(u => (
                                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition">
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{u.name}</div>
                                            {u.schoolName && <div className="text-xs text-gray-500 dark:text-gray-400">{u.schoolName}</div>}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${u.role === 'school'
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                }`}>{u.role}</span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{u.phone || "—"}</td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{formatDate(u.createdAt)}</td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => onDelete(u._id, u.name)}
                                                disabled={actionLoading === u._id}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
                                                title="Delete user"
                                            >
                                                {actionLoading === u._id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-right">{users.length} user(s)</p>
        </div>
    );
}

/* ============ LISTINGS TAB ============ */
function ListingsTab({ listings, loading, search, setSearch, onDelete, actionLoading, formatCurrency }) {
    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text" placeholder="Search by name, location, type..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                />
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden">
                {loading ? <LoadingSkeleton rows={5} /> : listings.length === 0 ? (
                    <p className="text-center py-12 text-gray-500 dark:text-gray-400">No listings found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800/50">
                                    <th className="px-5 py-3 font-medium">Name</th>
                                    <th className="px-5 py-3 font-medium">Owner</th>
                                    <th className="px-5 py-3 font-medium">Type</th>
                                    <th className="px-5 py-3 font-medium">Price/Day</th>
                                    <th className="px-5 py-3 font-medium">Capacity</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-neutral-800">
                                {listings.map(l => (
                                    <tr key={l._id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition">
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{l.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{l.location}</div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{l.owner?.schoolName || l.owner?.name || "—"}</td>
                                        <td className="px-5 py-4">
                                            <span className="inline-block px-2.5 py-1 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium">{l.spaceType}</span>
                                        </td>
                                        <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">{formatCurrency(l.price)}</td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{l.capacity}</td>
                                        <td className="px-5 py-4"><StatusBadge status={l.status || "active"} /></td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => onDelete(l._id, l.name)}
                                                disabled={actionLoading === l._id}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
                                                title="Delete listing"
                                            >
                                                {actionLoading === l._id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-right">{listings.length} listing(s)</p>
        </div>
    );
}

/* ============ BOOKINGS TAB ============ */
function BookingsTab({ bookings, loading, search, setSearch, statusFilter, setStatusFilter, onUpdateStatus, onDelete, actionLoading, formatCurrency, formatDate }) {
    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text" placeholder="Search by listing, teacher, school..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                    />
                </div>
                <div className="relative">
                    <select
                        value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden">
                {loading ? <LoadingSkeleton rows={5} /> : bookings.length === 0 ? (
                    <p className="text-center py-12 text-gray-500 dark:text-gray-400">No bookings found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800/50">
                                    <th className="px-5 py-3 font-medium">Listing</th>
                                    <th className="px-5 py-3 font-medium">Teacher</th>
                                    <th className="px-5 py-3 font-medium">School</th>
                                    <th className="px-5 py-3 font-medium">Date</th>
                                    <th className="px-5 py-3 font-medium">Price</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-neutral-800">
                                {bookings.map(b => (
                                    <tr key={b._id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition">
                                        <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">{b.listing?.name || "—"}</td>
                                        <td className="px-5 py-4">
                                            <div className="text-gray-900 dark:text-white">{b.teacher?.name || "—"}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{b.teacher?.email}</div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{b.school?.schoolName || "—"}</td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{formatDate(b.bookingDate)}</td>
                                        <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">{formatCurrency(b.totalPrice)}</td>
                                        <td className="px-5 py-4"><StatusBadge status={b.status} /></td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1">
                                                {/* Status update dropdown */}
                                                <div className="relative">
                                                    <select
                                                        value={b.status}
                                                        onChange={e => onUpdateStatus(b._id, e.target.value)}
                                                        disabled={actionLoading === b._id}
                                                        className="appearance-none pl-2 pr-6 py-1.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 dark:text-gray-300 cursor-pointer disabled:opacity-50"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="rejected">Rejected</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                                                </div>
                                                <button
                                                    onClick={() => onDelete(b._id)}
                                                    disabled={actionLoading === b._id}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
                                                    title="Delete booking"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-right">{bookings.length} booking(s)</p>
        </div>
    );
}

/* ============ SHARED COMPONENTS ============ */
function StatusBadge({ status }) {
    return (
        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${STATUS_COLORS[status] || STATUS_COLORS.pending}`}>
            {status}
        </span>
    );
}

function LoadingSkeleton({ rows = 3 }) {
    return (
        <div className="p-6 space-y-4">
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4">
                    <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/5" />
                </div>
            ))}
        </div>
    );
}
