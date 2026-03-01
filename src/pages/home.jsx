import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ListingCard from "../components/listingCard";
import { listingsAPI, favoritesAPI } from "../services/api";
import { Search, MapPin, Calendar, Building, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { API_BASE_URL } from "../lib/constants";

export default function Home() {
  const navigate = useNavigate();
  const { isBlock } = useTheme();
  const [searchParams, setSearchParams] = useState({
    location: "",
    date: "",
    spaceType: "",
    capacity: ""
  });

  const [featuredListings, setFeaturedListings] = useState([]);
  const [stats, setStats] = useState({ spaces: 0, schools: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Fetch featured listings and stats from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, statsRes] = await Promise.all([
          listingsAPI.getAll(),
          fetch(`${API_BASE_URL.replace('/api', '')}/api/stats/public`).then(r => r.json()).catch(() => ({ stats: { spaces: 0, schools: 0, bookings: 0 } }))
        ]);

        const apiListings = (listingsRes.data?.listings || []).slice(0, 6).map(l => ({
          ...l,
          id: l._id,
          image: l.images?.[0] || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
          lat: l.coordinates?.lat || 19.076,
          lng: l.coordinates?.lng || 72.877
        }));

        setFeaturedListings(apiListings);
        if (statsRes?.stats) setStats(statsRes.stats);
      } catch (err) {
        console.error("Failed to fetch home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch user's favorites to show correct heart state
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    favoritesAPI.getAll()
      .then(res => {
        const favs = res.data?.favorites || res.data || [];
        setFavoriteIds(new Set(favs.map(f => f._id || f.id)));
      })
      .catch(() => { });
  }, [isAuthenticated, authLoading]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchParams.location) params.append('location', searchParams.location);
    if (searchParams.spaceType) params.append('type', searchParams.spaceType);
    if (searchParams.date) params.append('date', searchParams.date);
    if (searchParams.capacity) params.append('capacity', searchParams.capacity);

    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className={cn("min-h-screen", isBlock ? "bg-[#FFFBEB] dark:bg-neutral-950" : "bg-slate-50 dark:bg-neutral-950")}>
      <Navbar />

      {/* Hero Section */}
      <section className={cn(
        "relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden transition-colors",
        isBlock ? "bg-[#FFFBEB] dark:bg-neutral-950" : "bg-slate-50 dark:bg-neutral-950"
      )}>
        {/* Background Elements */}
        {isBlock ? (
          <div className="absolute top-0 inset-x-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="absolute top-[15%] left-[5%] lg:left-[10%] w-48 h-48 bg-amber-400 border-4 border-slate-900 rounded-full shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hidden md:block"
            />
            <motion.div
              initial={{ x: 50, opacity: 0, rotate: 12 }}
              animate={{ x: 0, opacity: 1, rotate: 12 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute top-[25%] right-[5%] lg:right-[15%] w-40 h-40 bg-blue-500 border-4 border-slate-900 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hidden lg:block"
            />
            <motion.div
              initial={{ y: 50, opacity: 0, rotate: -6 }}
              animate={{ y: 0, opacity: 1, rotate: -6 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute -bottom-10 left-[40%] w-64 h-32 bg-cyan-400 border-4 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hidden md:block"
            />
          </div>
        ) : (
          <div className="absolute top-0 inset-x-0 h-[800px] overflow-hidden pointer-events-none overflow-x-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-lighten"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              className="absolute top-20 -left-20 w-[500px] h-[500px] bg-cyan-400/20 dark:bg-cyan-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-lighten"
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center mb-16 relative z-10"
          >
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className={cn(
                "inline-block px-4 py-1.5 mb-6 text-sm flex items-center gap-2 mx-auto justify-center max-w-fit w-full",
                isBlock
                  ? "rounded-full border-2 border-slate-900 bg-amber-300 text-slate-900 font-bold shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] uppercase tracking-wide"
                  : "rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-medium"
              )}
            >
              {!isBlock && <Sparkles className="w-4 h-4 text-amber-500" />}
              <span>The #1 Ed-Tech Marketplace</span>
            </motion.div> */}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className={cn(
                "text-5xl lg:text-7xl font-black mb-6",
                isBlock ? "text-slate-900 dark:text-white leading-[1.1] tracking-tight uppercase" : "text-slate-900 dark:text-white leading-[1.15] tracking-tight"
              )}
            >
              Find Your Perfect
              <br />
              <span className={cn(
                "relative inline-block",
                isBlock ? "text-blue-600 dark:text-blue-400" : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 pb-2"
              )}>
                Learning Space
                {/* Underline decoration */}
                {isBlock ? (
                  <svg className="absolute w-full h-4 -bottom-1 left-0 text-amber-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0 10 Q50 20 100 10" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                ) : (
                  <svg className="absolute w-full h-3 -bottom-1 hidden sm:block text-amber-400 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q50 10 100 5 L100 10 L0 10 Z" fill="currentColor" />
                  </svg>
                )}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className={cn(
                "text-xl mb-12 max-w-2xl mx-auto",
                isBlock ? "text-slate-700 dark:text-gray-300 font-medium leading-relaxed" : "text-slate-600 dark:text-gray-400 leading-relaxed"
              )}
            >
              Discover and rent classrooms, labs, and auditoriums from top schools and colleges. Perfect for tuition, training, and events.
            </motion.p>

            {/* Search Bar Block */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100, damping: 20 }}
              className={cn(
                "p-3 mx-auto max-w-5xl transition-all",
                isBlock
                  ? "bg-white dark:bg-neutral-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] border-4 border-slate-900 dark:border-neutral-700"
                  : "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-900/5 dark:shadow-none border border-white/50 dark:border-neutral-800"
              )}
            >
              <div className={cn(
                "flex flex-col md:flex-row items-center w-full",
                isBlock
                  ? "divide-y-2 md:divide-y-0 md:divide-x-2 divide-slate-100 dark:divide-neutral-800"
                  : "divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-neutral-800"
              )}>
                {/* Location */}
                <div className={cn(
                  "hover:bg-slate-50 dark:hover:bg-neutral-800 transition cursor-pointer flex-1 w-full group",
                  isBlock ? "p-3 lg:p-4 rounded-3xl md:rounded-l-[1.5rem]" : "p-4 lg:p-5 rounded-[2rem] md:rounded-l-[2rem]"
                )}>
                  <label className={cn("block mb-1 tracking-widest uppercase", isBlock ? "text-[11px] font-black text-slate-400 dark:text-gray-500" : "text-xs font-bold text-gray-400 dark:text-gray-500")}>Location</label>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Mumbai, India"
                      value={searchParams.location}
                      onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                      className={cn("border-0 p-0 focus:ring-0 dark:bg-transparent font-bold w-full bg-transparent", isBlock ? "text-slate-900 dark:text-white text-lg placeholder-slate-300 dark:placeholder-gray-600" : "text-gray-900 dark:text-white text-base placeholder-gray-400")}
                    />
                  </div>
                </div>

                {/* Date */}
                <div className={cn(
                  "hover:bg-slate-50 dark:hover:bg-neutral-800 transition cursor-pointer flex-1 w-full md:rounded-none group",
                  isBlock ? "p-3 lg:p-4" : "p-4 lg:p-5"
                )}>
                  <label className={cn("block mb-1 tracking-widest uppercase", isBlock ? "text-[11px] font-black text-slate-400 dark:text-gray-500" : "text-xs font-bold text-gray-400 dark:text-gray-500")}>Date</label>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="date"
                      placeholder="Select date"
                      value={searchParams.date}
                      onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                      className={cn("border-0 p-0 focus:ring-0 dark:bg-transparent font-bold w-full bg-transparent", isBlock ? "text-slate-900 dark:text-white text-lg placeholder-slate-300 dark:placeholder-gray-600" : "text-gray-900 dark:text-white text-base placeholder-gray-400")}
                    />
                  </div>
                </div>

                {/* Space Type */}
                <div className={cn(
                  "hover:bg-slate-50 dark:hover:bg-neutral-800 transition cursor-pointer flex-1 w-full md:rounded-none group",
                  isBlock ? "p-3 lg:p-4" : "p-4 lg:p-5"
                )}>
                  <label className={cn("block mb-1 tracking-widest uppercase", isBlock ? "text-[11px] font-black text-slate-400 dark:text-gray-500" : "text-xs font-bold text-gray-400 dark:text-gray-500")}>Space Type</label>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <select
                      value={searchParams.spaceType}
                      onChange={(e) => setSearchParams({ ...searchParams, spaceType: e.target.value })}
                      className={cn(
                        "border-0 p-0 focus:ring-0 cursor-pointer bg-transparent font-bold w-full",
                        isBlock
                          ? "text-slate-900 dark:text-white text-lg [&>option]:bg-white dark:[&>option]:bg-neutral-900 [&>option]:text-slate-900 dark:[&>option]:text-white"
                          : "text-gray-900 dark:text-white text-base [&>option]:bg-white dark:[&>option]:bg-neutral-900 text-gray-900"
                      )}
                    >
                      <option value="">Any type</option>
                      <option value="Classroom">Classroom</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Auditorium">Auditorium</option>
                      <option value="Sports Hall">Sports Hall</option>
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="p-2 w-full md:w-auto">
                  <button
                    onClick={handleSearch}
                    className={cn(
                      "w-full md:w-16 h-14 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all",
                      isBlock
                        ? "rounded-[1.2rem] border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-none shadow-blue-900/40"
                        : "rounded-[1.8rem] shadow-lg shadow-blue-600/30"
                    )}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Dynamic Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16"
          >
            {[
              { label: "Verified Spaces", value: stats.spaces, color: "text-blue-600 dark:text-blue-400" },
              { label: "Schools & Colleges", value: stats.schools, color: "text-amber-500 dark:text-amber-400" },
              { label: "Bookings Made", value: stats.bookings, color: "text-cyan-500 dark:text-cyan-400" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
              >
                <div className={`text-4xl lg:text-5xl font-black mb-1 ${stat.color}`}>{stat.value || "0"}+</div>
                <div className="text-slate-500 dark:text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className={cn(
        "py-20 px-6 lg:px-8 border-t",
        isBlock
          ? "bg-[#FFFBEB] dark:bg-neutral-950 border-slate-900/10 dark:border-neutral-800"
          : "bg-white dark:bg-neutral-900 border-slate-100 dark:border-neutral-800"
      )}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <h2 className={cn("font-black mb-3", isBlock ? "text-4xl text-slate-900 dark:text-white uppercase tracking-tight" : "text-4xl text-slate-900 dark:text-white")}>
                Featured Spaces
              </h2>
              <p className={cn("text-lg", isBlock ? "text-slate-600 dark:text-gray-400 font-medium" : "text-slate-500 dark:text-gray-400")}>
                Handpicked spaces from top institutions
              </p>
            </div>
            <Link
              to="/listings"
              className={cn(
                "hidden md:flex items-center gap-2 font-bold hover:gap-3 transition-all",
                isBlock ? "text-blue-700 dark:text-blue-400 px-4 py-2 border-2 border-slate-900 dark:border-blue-400 rounded-xl hover:bg-amber-100 dark:hover:bg-blue-900/30 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-none bg-white dark:bg-transparent" : "text-blue-600 dark:text-blue-400"
              )}
            >
              View all
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-200 dark:bg-neutral-700" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredListings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No spaces listed yet. Be the first to list your space!</p>
              <Link to="/register" className="inline-block mt-4 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:opacity-90 transition">
                List Your Space
              </Link>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredListings.map((item) => (
                <motion.div
                  key={item._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <ListingCard item={item} isFavorited={favoriteIds.has(item._id)} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12 md:hidden">
            <Link
              to="/listings"
              className={cn(
                "inline-flex items-center gap-2 px-8 py-3 font-bold transition-all",
                isBlock
                  ? "bg-white text-blue-700 border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-none hover:bg-amber-100"
                  : "bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg hover:shadow-blue-500/50"
              )}
            >
              View all spaces
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={cn(
        "py-24 px-6 lg:px-8",
        isBlock ? "bg-amber-400 dark:bg-amber-900/20 border-t-4 border-slate-900 dark:border-neutral-800" : "bg-slate-50 dark:bg-neutral-950"
      )}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={cn("mb-4", isBlock ? "text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight" : "text-4xl font-black text-slate-900 dark:text-white")}>
              How It Works
            </h2>
            <p className={cn("text-lg max-w-2xl mx-auto", isBlock ? "text-slate-800 dark:text-amber-100/70 font-bold" : "text-slate-500 dark:text-gray-400")}>
              Renting a school or college space is simple and hassle-free
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "01",
                title: "Browse Spaces",
                description: "Search and filter through verified classrooms, labs, auditoriums, and sports halls near you.",
                color: "from-blue-500 to-blue-600",
                icon: (
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )
              },
              {
                step: "02",
                title: "Book Instantly",
                description: "Choose your date, time slot, and purpose. Send a booking request directly to the school.",
                color: "from-amber-400 to-amber-500",
                icon: (
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                step: "03",
                title: "Start Teaching",
                description: "Once confirmed, arrive at the space and start your classes, training, or events.",
                color: "from-cyan-400 to-cyan-500",
                icon: (
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )
              }
            ].map((item) => (
              <motion.div
                key={item.step}
                className="relative group h-full"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <div className={cn(
                  "p-8 h-full flex flex-col items-start z-10 relative transition-all",
                  isBlock
                    ? "bg-white dark:bg-neutral-900 rounded-2xl border-4 border-slate-900 dark:border-neutral-700 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]"
                    : "bg-white dark:bg-neutral-900 rounded-[2rem] border border-slate-100 dark:border-neutral-800 hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1"
                )}>
                  <div className="flex items-center gap-4 mb-5 w-full">
                    <div className={cn(
                      "flex items-center justify-center transform group-hover:rotate-0 transition-transform duration-300",
                      isBlock
                        ? "w-14 h-14 bg-amber-300 border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                        : `w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl shadow-lg -rotate-3`
                    )}>
                      {isBlock
                        ? <div className="text-slate-900">{item.icon}</div>
                        : item.icon
                      }
                    </div>
                    <span className={cn("text-5xl font-black ml-auto", isBlock ? "text-amber-100 dark:text-neutral-800 drop-shadow-sm" : "text-slate-100 dark:text-neutral-800")}>{item.step}</span>
                  </div>
                  <h3 className={cn("text-xl mb-3", isBlock ? "font-black text-slate-900 dark:text-white uppercase tracking-wide" : "font-bold text-slate-900 dark:text-white")}>{item.title}</h3>
                  <p className={cn("leading-relaxed", isBlock ? "text-slate-700 dark:text-gray-300 font-medium" : "text-slate-500 dark:text-gray-400")}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={cn(
        "py-24 px-6 lg:px-8 relative overflow-hidden",
        isBlock ? "bg-blue-600 dark:bg-blue-900 border-y-4 border-slate-900 dark:border-neutral-800" : "bg-blue-600 dark:bg-blue-900"
      )}>
        {/* Decorative Elements */}
        {isBlock ? (
          <>
            <div className="absolute top-10 right-10 w-32 h-32 bg-amber-400 border-4 border-slate-900 rounded-full shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] opacity-50 hidden md:block"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-cyan-400 border-4 border-slate-900 rounded-xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] opacity-50 hidden md:block rotate-12"></div>
          </>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/20 rounded-full filter blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className={cn("mb-6", isBlock ? "text-4xl lg:text-5xl font-black text-white uppercase tracking-tight" : "text-4xl lg:text-5xl font-black text-white")}>
            Ready to Find Your Space?
          </h2>
          <p className={cn("mb-10 max-w-2xl mx-auto", isBlock ? "text-xl text-blue-100 font-medium" : "text-xl text-blue-100 leading-relaxed")}>
            Whether you're a teacher looking for a classroom or a school wanting to earn from idle spaces — EduSpace connects you.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-8">
            <Link
              to="/listings"
              className={cn(
                "px-8 py-4 font-bold transition-all text-center flex items-center justify-center gap-2",
                isBlock
                  ? "bg-amber-300 text-slate-900 border-2 border-slate-900 rounded-xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                  : "bg-white text-blue-700 rounded-full hover:bg-slate-50 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1"
              )}
            >
              Browse Spaces
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/register"
              className={cn(
                "px-8 py-4 font-bold transition-all text-center flex items-center justify-center",
                isBlock
                  ? "bg-white text-slate-900 border-2 border-slate-900 rounded-xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                  : "bg-transparent text-white border-2 border-white/30 rounded-full hover:bg-white/10 hover:border-white"
              )}
            >
              List Your Space
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
