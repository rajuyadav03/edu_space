import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { adminAPI, userAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import SEO from '../components/SEO';
import {
    LayoutDashboard, Users, Building2, CalendarCheck,
    Search, Trash2, ChevronDown, TrendingUp, IndianRupee,
    AlertCircle, RefreshCw, Shield, ShieldCheck, ExternalLink, Check, X,
    Calendar, DollarSign, Settings, BookOpen, Clock, UserCheck, XCircle,
    Activity, ArrowUpRight, BarChart3
} from "lucide-react";

const STATUS_COLORS = {
    pending: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    completed: "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800",
    rejected: "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
    cancelled: "bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700"
};

/* Stagger animation config — per Emil's principle: 30-80ms between items */
const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const staggerItem = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: [0.23, 1, 0.32, 1] /* Strong ease-out per Emil */
        }
    }
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

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
    const [kycUsers, setKycUsers] = useState([]);

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

    // Fetch data based on active tab
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
            } else if (activeTab === "kyc") {
                const res = await userAPI.getPendingKYC();
                setKycUsers(res.data.users || []);
            }
        } catch (err) {
            console.error("Admin fetch error:", err);
            setError("Failed to load data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [activeTab, isAuthenticated, user]);

    useEffect(() => {
        if (isAuthenticated && user?.role === "admin") {
            fetchTabData();
        }
    }, [fetchTabData, isAuthenticated]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAuthenticated && user?.role === "admin") {
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

    const handleVerifyKYC = async (userId, status) => {
        let note = '';
        if (status === 'rejected') {
            note = window.prompt('Enter reason for rejection:');
            if (!note) return;
        }
        if (status === 'verified' && !window.confirm('Approve this teacher\'s identity verification?')) return;
        try {
            setActionLoading(userId);
            await userAPI.verifyKYC(userId, { status, note });
            setKycUsers(prev => prev.filter(u => status === 'verified' ? u._id !== userId : true).map(u => u._id === userId ? { ...u, idVerificationStatus: status, idVerificationNote: note } : u));
            showSuccess(`KYC ${status} successfully`);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${status} KYC`);
        } finally {
            setActionLoading(null);
        }
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "users", label: "Users", icon: Users },
        { id: "listings", label: "Listings", icon: Building2 },
        { id: "bookings", label: "Bookings", icon: CalendarCheck },
        { id: "kyc", label: "KYC Verify", icon: ShieldCheck }
    ];

    const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const formatCurrency = (n) => `₹${(n || 0).toLocaleString("en-IN")}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
            <SEO title="Admin Console" />
            <Navbar />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20 ring-1 ring-purple-500/20">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Admin Console</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage everything on the platform</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchTabData}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:border-gray-300 dark:hover:border-neutral-600 transition-all duration-200 shadow-sm active:scale-[0.97]"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </motion.div>

                {/* Alerts */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                            className="mb-6 p-4 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/50 rounded-2xl flex items-center gap-3 backdrop-blur-sm"
                        >
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </div>
                            <p className="text-red-700 dark:text-red-300 text-sm font-medium flex-1">{error}</p>
                            <button onClick={() => setError("")} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors active:scale-[0.95]">
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                            className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl flex items-center gap-3 backdrop-blur-sm"
                        >
                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">{successMsg}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tabs — pill-style with animated indicator */}
                <div className="flex gap-1 mb-8 bg-white/80 dark:bg-neutral-900/80 p-1.5 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-sm backdrop-blur-sm overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap active:scale-[0.97] ${activeTab === tab.id
                                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg shadow-gray-900/10 dark:shadow-white/10"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-neutral-800"
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content with AnimatePresence for smooth transitions */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    >
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
                        {activeTab === "kyc" && (
                            <KYCTab
                                users={kycUsers} loading={loading}
                                onVerify={handleVerifyKYC} actionLoading={actionLoading} formatDate={formatDate}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
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
        { label: "Total Users", value: stats.totalUsers, icon: Users, gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-900/15", ring: "ring-blue-500/10" },
        { label: "Schools", value: stats.totalSchools, icon: Building2, gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-900/15", ring: "ring-emerald-500/10" },
        { label: "Teachers", value: stats.totalTeachers, icon: Users, gradient: "from-violet-500 to-purple-500", bg: "bg-violet-50 dark:bg-violet-900/15", ring: "ring-violet-500/10" },
        { label: "Active Listings", value: stats.activeListings, icon: Building2, gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-900/15", ring: "ring-amber-500/10" },
        { label: "Total Bookings", value: stats.totalBookings, icon: CalendarCheck, gradient: "from-rose-500 to-pink-500", bg: "bg-rose-50 dark:bg-rose-900/15", ring: "ring-rose-500/10" },
        { label: "Pending", value: stats.pendingBookings, icon: Clock, gradient: "from-yellow-500 to-amber-500", bg: "bg-yellow-50 dark:bg-yellow-900/15", ring: "ring-yellow-500/10" },
        { label: "Confirmed", value: stats.confirmedBookings, icon: TrendingUp, gradient: "from-green-500 to-emerald-500", bg: "bg-green-50 dark:bg-green-900/15", ring: "ring-green-500/10" },
        { label: "Revenue", value: formatCurrency(stats.totalRevenue), icon: IndianRupee, gradient: "from-indigo-500 to-blue-600", bg: "bg-indigo-50 dark:bg-indigo-900/15", ring: "ring-indigo-500/10" }
    ];

    return (
        <div className="space-y-8">
            {/* Stat Cards — staggered entrance per Emil's skill */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
                {statCards.map((card, i) => (
                    <motion.div
                        key={i}
                        variants={staggerItem}
                        className={`group relative overflow-hidden bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 p-5 ring-1 ${card.ring} hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20 transition-shadow duration-300`}
                    >
                        <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${card.gradient} opacity-[0.07] rounded-full blur-xl group-hover:opacity-[0.12] transition-opacity duration-500`} />
                        <div className={`w-10 h-10 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
                            <card.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{card.value}</p>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{card.label}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Recent Bookings */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <Activity className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Bookings</h3>
                    </div>
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{recentBookings.length} entries</span>
                </div>
                {recentBookings.length === 0 ? (
                    <EmptyState icon={CalendarCheck} message="No bookings yet" />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/30">
                                    <th className="px-6 py-3">Listing</th>
                                    <th className="px-6 py-3">Teacher</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/50">
                                {recentBookings.map(b => (
                                    <tr key={b._id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/30 transition-colors duration-150">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{b.listing?.name || "—"}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{b.teacher?.name || "—"}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 tabular-nums">{formatDate(b.bookingDate)}</td>
                                        <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
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
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text" placeholder="Search by name, email, phone..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-gray-900 dark:text-white placeholder:text-gray-400 transition-all duration-200"
                    />
                </div>
                <div className="relative">
                    <select
                        value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-gray-900 dark:text-white cursor-pointer transition-all duration-200"
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
                    <EmptyState icon={Users} message="No users found" />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-neutral-800/30">
                                    <th className="px-6 py-3.5">Name</th>
                                    <th className="px-6 py-3.5">Email</th>
                                    <th className="px-6 py-3.5">Role</th>
                                    <th className="px-6 py-3.5">Phone</th>
                                    <th className="px-6 py-3.5">Joined</th>
                                    <th className="px-6 py-3.5">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/50">
                                {users.map(u => (
                                    <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/30 transition-colors duration-150 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {u.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-white">{u.name}</div>
                                                    {u.schoolName && <div className="text-xs text-gray-500 dark:text-gray-400">{u.schoolName}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${u.role === 'school'
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                                                : 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800'
                                            }`}>{u.role}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 tabular-nums">{u.phone || "—"}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 tabular-nums">{formatDate(u.createdAt)}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => onDelete(u._id, u.name)}
                                                disabled={actionLoading === u._id}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-150 disabled:opacity-50 opacity-0 group-hover:opacity-100 active:scale-[0.95]"
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
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 text-right tabular-nums">{users.length} user(s)</p>
        </div>
    );
}

/* ============ LISTINGS TAB ============ */
function ListingsTab({ listings, loading, search, setSearch, onDelete, actionLoading, formatCurrency }) {
    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text" placeholder="Search by name, location, type..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-gray-900 dark:text-white placeholder:text-gray-400 transition-all duration-200"
                />
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden">
                {loading ? <LoadingSkeleton rows={5} /> : listings.length === 0 ? (
                    <EmptyState icon={Building2} message="No listings found" />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-neutral-800/30">
                                    <th className="px-6 py-3.5">Name</th>
                                    <th className="px-6 py-3.5">Owner</th>
                                    <th className="px-6 py-3.5">Type</th>
                                    <th className="px-6 py-3.5">Price/Day</th>
                                    <th className="px-6 py-3.5">Capacity</th>
                                    <th className="px-6 py-3.5">Status</th>
                                    <th className="px-6 py-3.5">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/50">
                                {listings.map(l => (
                                    <tr key={l._id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/30 transition-colors duration-150 group">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 dark:text-white">{l.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{l.location}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{l.owner?.schoolName || l.owner?.name || "—"}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold">{l.spaceType}</span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white tabular-nums">{formatCurrency(l.price)}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 tabular-nums">{l.capacity}</td>
                                        <td className="px-6 py-4"><StatusBadge status={l.status || "active"} /></td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => onDelete(l._id, l.name)}
                                                disabled={actionLoading === l._id}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-150 disabled:opacity-50 opacity-0 group-hover:opacity-100 active:scale-[0.95]"
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
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 text-right tabular-nums">{listings.length} listing(s)</p>
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
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text" placeholder="Search by listing, teacher, school..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-gray-900 dark:text-white placeholder:text-gray-400 transition-all duration-200"
                    />
                </div>
                <div className="relative">
                    <select
                        value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-gray-900 dark:text-white cursor-pointer transition-all duration-200"
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
                    <EmptyState icon={CalendarCheck} message="No bookings found" />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-neutral-800/30">
                                    <th className="px-6 py-3.5">Listing</th>
                                    <th className="px-6 py-3.5">Teacher</th>
                                    <th className="px-6 py-3.5">School</th>
                                    <th className="px-6 py-3.5">Date</th>
                                    <th className="px-6 py-3.5">Price</th>
                                    <th className="px-6 py-3.5">Status</th>
                                    <th className="px-6 py-3.5">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/50">
                                {bookings.map(b => (
                                    <tr key={b._id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/30 transition-colors duration-150 group">
                                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{b.listing?.name || "—"}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 dark:text-white font-medium">{b.teacher?.name || "—"}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{b.teacher?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{b.school?.schoolName || "—"}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 tabular-nums">{formatDate(b.bookingDate)}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white tabular-nums">{formatCurrency(b.totalPrice)}</td>
                                        <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className="relative">
                                                    <select
                                                        value={b.status}
                                                        onChange={e => onUpdateStatus(b._id, e.target.value)}
                                                        disabled={actionLoading === b._id}
                                                        className="appearance-none pl-2.5 pr-7 py-1.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-700 dark:text-gray-300 cursor-pointer disabled:opacity-50 transition-all duration-150"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="rejected">Rejected</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                                                </div>
                                                <button
                                                    onClick={() => onDelete(b._id)}
                                                    disabled={actionLoading === b._id}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-150 disabled:opacity-50 opacity-0 group-hover:opacity-100 active:scale-[0.95]"
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
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 text-right tabular-nums">{bookings.length} booking(s)</p>
        </div>
    );
}

/* ============ KYC TAB ============ */
function KYCTab({ users, loading, onVerify, actionLoading, formatDate }) {
    const KYC_STATUS_COLORS = {
        pending: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
        rejected: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800'
    };

    return (
        <div className="space-y-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden">
                {loading ? <LoadingSkeleton rows={5} /> : users.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-8 h-8 text-emerald-500" />
                        </div>
                        <p className="text-gray-900 dark:text-white font-semibold text-lg">All caught up!</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1.5">No pending KYC submissions to review</p>
                    </div>
                ) : (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="divide-y divide-gray-100 dark:divide-neutral-800"
                    >
                        {users.map(u => (
                            <motion.div key={u._id} variants={staggerItem} className="p-6 hover:bg-gray-50/50 dark:hover:bg-neutral-800/30 transition-colors duration-150">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                                    {/* User Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                {u.name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 dark:text-white">{u.name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email} • {u.phone || 'No phone'}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${KYC_STATUS_COLORS[u.idVerificationStatus] || KYC_STATUS_COLORS.pending}`}>
                                                {u.idVerificationStatus}
                                            </span>
                                        </div>

                                        {/* ID Info */}
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mt-3 ml-14">
                                            {u.aadhaarLast4 && (
                                                <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-neutral-800 px-3 py-1.5 rounded-lg text-xs">
                                                    <span className="font-semibold text-gray-700 dark:text-gray-300">Aadhaar:</span> ●●●● ●●●● {u.aadhaarLast4}
                                                </span>
                                            )}
                                            {u.panLast4 && (
                                                <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-neutral-800 px-3 py-1.5 rounded-lg text-xs">
                                                    <span className="font-semibold text-gray-700 dark:text-gray-300">PAN:</span> ●●●●●●{u.panLast4}
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(u.createdAt)}</span>
                                        </div>

                                        {/* Document Link */}
                                        {u.idDocumentUrl && (
                                            <a
                                                href={u.idDocumentUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 mt-3 ml-14 px-3.5 py-2 bg-blue-50 dark:bg-blue-900/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 rounded-xl text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/25 transition-colors duration-150 active:scale-[0.97]"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                View ID Document
                                            </a>
                                        )}

                                        {u.idVerificationNote && (
                                            <p className="mt-2 ml-14 text-xs text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/10 px-3 py-2 rounded-lg inline-block">
                                                Previous rejection: {u.idVerificationNote}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 sm:flex-col ml-14 sm:ml-0">
                                        <button
                                            onClick={() => onVerify(u._id, 'verified')}
                                            disabled={actionLoading === u._id}
                                            className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-50 shadow-sm shadow-emerald-600/20 active:scale-[0.97]"
                                        >
                                            {actionLoading === u._id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => onVerify(u._id, 'rejected')}
                                            disabled={actionLoading === u._id}
                                            className="flex items-center gap-1.5 px-5 py-2.5 bg-white dark:bg-neutral-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-50 active:scale-[0.97]"
                                        >
                                            {actionLoading === u._id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 text-right tabular-nums">{users.length} submission(s)</p>
        </div>
    );
}

/* ============ SHARED COMPONENTS ============ */
function StatusBadge({ status }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${STATUS_COLORS[status] || STATUS_COLORS.pending}`}>
            {status}
        </span>
    );
}

function EmptyState({ icon: Icon, message }) {
    return (
        <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{message}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
        </div>
    );
}

function LoadingSkeleton({ rows = 3 }) {
    return (
        <div className="p-6 space-y-5">
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded-lg w-1/4" />
                    <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded-lg w-1/3" />
                    <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded-lg w-1/5" />
                </div>
            ))}
        </div>
    );
}
