import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ListingCard from "../components/listingCard";
import { listings } from "../data/listings";

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: "",
    date: "",
    spaceType: "",
    capacity: ""
  });

  const featuredListings = listings.slice(0, 6);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchParams.location) params.append('location', searchParams.location);
    if (searchParams.spaceType) params.append('type', searchParams.spaceType);
    if (searchParams.date) params.append('date', searchParams.date);
    if (searchParams.capacity) params.append('capacity', searchParams.capacity);
    
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <>
      <Navbar />

      {/* HERO SECTION - Dribbble Style */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              Find Your Perfect
              <br />
              <span className="text-gray-400 dark:text-gray-500">Learning Space</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Discover and rent classrooms, labs, and auditoriums from top schools and colleges. Perfect for tuition, training, and events.
            </p>

            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {/* Location */}
                <div className="p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">LOCATION</label>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Mumbai, India"
                      value={searchParams.location}
                      onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
                      className="border-0 p-0 focus:ring-0 text-gray-900 dark:text-white dark:bg-transparent font-medium placeholder-gray-400 dark:placeholder-gray-500 w-full"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">DATE</label>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input 
                      type="date" 
                      placeholder="Select date"
                      value={searchParams.date}
                      onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
                      className="border-0 p-0 focus:ring-0 text-gray-900 dark:text-white dark:bg-transparent font-medium placeholder-gray-400 dark:placeholder-gray-500 w-full"
                    />
                  </div>
                </div>

                {/* Space Type */}
                <div className="p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">SPACE TYPE</label>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <select 
                      value={searchParams.spaceType}
                      onChange={(e) => setSearchParams({...searchParams, spaceType: e.target.value})}
                      className="border-0 p-0 focus:ring-0 text-gray-900 dark:text-white bg-transparent font-medium w-full [&>option]:bg-white [&>option]:text-gray-900"
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
                <button 
                  onClick={handleSearch}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl px-8 py-4 font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            <div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">100+</div>
              <div className="text-gray-600 dark:text-gray-400">Verified Spaces</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Schools & Colleges</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">1000+</div>
              <div className="text-gray-600 dark:text-gray-400">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="py-20 px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Featured Spaces</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">Handpicked spaces from top institutions</p>
            </div>
            <Link 
              to="/listings" 
              className="hidden md:flex items-center gap-2 text-gray-900 dark:text-white font-semibold hover:gap-3 transition-all"
            >
              View all
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link 
              to="/listings"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              View all spaces
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
