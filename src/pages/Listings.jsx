import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/navbar";
import ListingCard from "../components/listingCard";
import MapView from "../components/MapView";
import ErrorBoundary from "../components/ErrorBoundary";
import { ListingGridSkeleton } from "../components/Skeleton";
import { listingsAPI, favoritesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { DEFAULT_MAP_CENTER, PRICE_RANGE, SPACE_TYPES } from "../lib/constants";

export default function Listings() {
  const [searchParams] = useSearchParams();
  const [hoveredListing, setHoveredListing] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState([PRICE_RANGE.min, PRICE_RANGE.max]);
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const { isAuthenticated } = useAuth();

  // Fetch listings from backend on mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setError(null);
        const res = await listingsAPI.getAll();

        if (res.data?.listings && res.data.listings.length > 0) {
          // Format listings for component compatibility
          const apiListings = res.data.listings.map(listing => ({
            ...listing,
            id: listing._id, // Use _id as id for compatibility
            lat: listing.coordinates?.lat || DEFAULT_MAP_CENTER.lat,
            lng: listing.coordinates?.lng || DEFAULT_MAP_CENTER.lng,
            image: listing.images?.[0] || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"
          }));
          setAllListings(apiListings);
        } else {
          // No listings available
          setAllListings([]);
        }
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        setError("Failed to load listings. Please try again later.");
        setAllListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Fetch user's favorites to show correct heart state
  useEffect(() => {
    if (!isAuthenticated) return;
    favoritesAPI.getAll()
      .then(res => {
        const favs = res.data?.favorites || res.data || [];
        setFavoriteIds(new Set(favs.map(f => f._id || f.id)));
      })
      .catch(() => { });
  }, [isAuthenticated]);

  // Memoized filtering - recomputes only when dependencies change
  const filteredListings = useMemo(() => {
    if (allListings.length === 0) return [];

    let result = [...allListings];

    // Apply URL search params from home page
    const locationParam = searchParams.get('location');
    const typeParam = searchParams.get('type');

    if (locationParam) {
      result = result.filter(item =>
        item.location?.toLowerCase().includes(locationParam.toLowerCase())
      );
    }

    if (typeParam) {
      result = result.filter(item => item.spaceType === typeParam);
    }

    // Apply active filter (skip if URL has type param to avoid double filtering)
    if (activeFilter !== "All" && !typeParam) {
      result = result.filter(item => item.spaceType === activeFilter);
    }

    // Apply price range
    result = result.filter(item =>
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "capacity-low":
        result.sort((a, b) => a.capacity - b.capacity);
        break;
      case "capacity-high":
        result.sort((a, b) => b.capacity - a.capacity);
        break;
      default:
        break;
    }

    return result;
  }, [allListings, activeFilter, sortBy, priceRange, searchParams]);

  const filters = SPACE_TYPES;

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Navbar />

      <div className="flex-1 flex pt-20">
        {/* LEFT SIDE - LISTINGS */}
        <div className="w-full lg:w-1/2 overflow-y-auto bg-white dark:bg-neutral-950">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Available Spaces
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {filteredListings.length} spaces available
              </p>
            </div>

            {/* Sort & Price Range */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:border-gray-900 dark:hover:border-neutral-600 transition"
              >
                <option value="default">Sort by: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="capacity-low">Capacity: Low to High</option>
                <option value="capacity-high">Capacity: High to Low</option>
              </select>

              <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Price Range:</label>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value) || 0;
                    setPriceRange([newMin, Math.max(newMin, priceRange[1])]);
                  }}
                  className="w-20 border-0 p-0 focus:ring-0 text-gray-900 dark:text-white dark:bg-transparent font-medium"
                  min="0"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value) || 0;
                    setPriceRange([Math.min(priceRange[0], newMax), newMax]);
                  }}
                  className="w-20 border-0 p-0 focus:ring-0 text-gray-900 dark:text-white dark:bg-transparent font-medium"
                  min="0"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-xl font-medium transition whitespace-nowrap ${activeFilter === filter
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-neutral-500'
                    }`}
                >
                  {filter === "All" ? "All Spaces" : filter}
                </button>
              ))}
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {loading ? (
                <ListingGridSkeleton count={4} />
              ) : error ? (
                <div className="col-span-2 text-center py-12">
                  <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-xl text-red-500 mb-2">{error}</p>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Make sure the backend server is running.</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredListings.length > 0 ? (
                filteredListings.map((item) => (
                  <ListingCard
                    key={item.id}
                    item={item}
                    onHover={setHoveredListing}
                    isFavorited={favoriteIds.has(item._id || item.id)}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xl text-gray-500 dark:text-gray-400">No spaces found matching your criteria</p>
                  <button
                    onClick={() => {
                      setActiveFilter("All");
                      setPriceRange([0, 5000]);
                      setSortBy("default");
                    }}
                    className="mt-4 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - MAP */}
        <div className="hidden lg:block lg:w-1/2 sticky top-20 h-[calc(100vh-5rem)]">
          <ErrorBoundary
            fallbackTitle="Map unavailable"
            fallbackMessage="The map couldn't load. Please refresh the page."
          >
            <MapView
              listings={filteredListings}
              hoveredListing={hoveredListing}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
