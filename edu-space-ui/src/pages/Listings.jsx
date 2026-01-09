import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/navbar";
import ListingCard from "../components/listingCard";
import MapView from "../components/MapView";
import { listings } from "../data/listings";

export default function Listings() {
  const [searchParams] = useSearchParams();
  const [hoveredListing, setHoveredListing] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [filteredListings, setFilteredListings] = useState(listings);

  useEffect(() => {
    let result = [...listings];

    // Apply URL search params from home page
    const locationParam = searchParams.get('location');
    const typeParam = searchParams.get('type');
    const dateParam = searchParams.get('date');

    if (locationParam) {
      result = result.filter(item => 
        item.location.toLowerCase().includes(locationParam.toLowerCase())
      );
    }

    if (typeParam) {
      result = result.filter(item => item.spaceType === typeParam);
      setActiveFilter(typeParam);
    }

    // Apply active filter
    if (activeFilter !== "All") {
      result = result.filter(item => item.spaceType === activeFilter);
    }

    // Apply price range
    result = result.filter(item => 
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Apply sorting
    switch(sortBy) {
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

    setFilteredListings(result);
  }, [activeFilter, sortBy, priceRange, searchParams]);

  const filters = ["All", "Classroom", "Laboratory", "Auditorium", "Sports Hall"];

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      <div className="flex-1 flex pt-20">
        {/* LEFT SIDE - LISTINGS */}
        <div className="w-full lg:w-1/2 overflow-y-auto bg-white dark:bg-gray-900">
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
                className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:border-gray-900 dark:hover:border-gray-500 transition"
              >
                <option value="default">Sort by: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="capacity-low">Capacity: Low to High</option>
                <option value="capacity-high">Capacity: High to Low</option>
              </select>

              <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Price Range:</label>
                <input 
                  type="number" 
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-20 border-0 p-0 focus:ring-0 text-gray-900 dark:text-white dark:bg-transparent font-medium"
                  min="0"
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-20 border-0 p-0 focus:ring-0 text-gray-900 font-medium"
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
                  className={`px-5 py-2.5 rounded-xl font-medium transition whitespace-nowrap ${
                    activeFilter === filter
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-900'
                  }`}
                >
                  {filter === "All" ? "All Spaces" : filter}
                </button>
              ))}
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredListings.length > 0 ? (
                filteredListings.map((item) => (
                  <ListingCard 
                    key={item.id} 
                    item={item}
                    onHover={setHoveredListing}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xl text-gray-500">No spaces found matching your criteria</p>
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
          <MapView 
            listings={filteredListings}
            hoveredListing={hoveredListing}
          />
        </div>
      </div>
    </div>
  );
}
