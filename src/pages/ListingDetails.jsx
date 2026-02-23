import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import BookingModal from "../components/BookingModal";
import { listingsAPI } from "../services/api";
import { listings as dummyListings } from "../data/listings";

// Fix Leaflet default marker icon for production builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Try to fetch from backend first, fallback to dummy data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        // Check if ID looks like a MongoDB ObjectId (24 hex chars)
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

        if (isObjectId) {
          const res = await listingsAPI.getOne(id);
          if (res.data?.listing) {
            // Format listing for component compatibility
            const apiListing = res.data.listing;
            setListing({
              ...apiListing,
              _id: apiListing._id,
              lat: apiListing.coordinates?.lat || 19.076,
              lng: apiListing.coordinates?.lng || 72.877,
              image: apiListing.images?.[0] || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"
            });
            setLoading(false);
            return;
          }
        }

        // Fallback to dummy data for numeric IDs
        const dummyListing = dummyListings.find((item) => item.id === parseInt(id));
        setListing(dummyListing || null);
      } catch (err) {
        // Fallback to dummy data on error
        const dummyListing = dummyListings.find((item) => item.id === parseInt(id));
        setListing(dummyListing || null);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20 bg-white dark:bg-neutral-950">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!listing) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20 bg-white dark:bg-neutral-950">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Listing Not Found</h1>
            <Link to="/listings" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
              ← Back to Listings
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="pt-20 bg-white dark:bg-neutral-950 min-h-screen">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to listings
          </Link>
        </div>

        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="lg:row-span-2 rounded-2xl overflow-hidden h-[400px] lg:h-[600px]">
              <img
                src={(listing.images?.[0]) || listing.image || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"}
                alt={listing.name || "Space"}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"; }}
              />
            </div>
            {/* Gallery Image 2 */}
            <div className="rounded-2xl overflow-hidden h-[190px] lg:h-[292px] bg-gray-200 dark:bg-neutral-800">
              <img
                src={(listing.images?.[1]) || (listing.images?.[0]) || listing.image || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"}
                alt={`${listing.name} - 2`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"; }}
              />
            </div>
            {/* Gallery Image 3 */}
            <div className="rounded-2xl overflow-hidden h-[190px] lg:h-[292px] bg-gray-200 dark:bg-neutral-800">
              <img
                src={(listing.images?.[2]) || (listing.images?.[0]) || listing.image || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"}
                alt={`${listing.name} - 3`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"; }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title & Location */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{listing.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-6">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {listing.location}
                </p>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-6 pb-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-900 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Capacity</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{listing.capacity} students</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-900 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Space Type</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{listing.spaceType}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-900 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Available</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{listing.availability}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Space</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  {listing.description}
                </p>
              </div>

              {/* Amenities */}
              {listing.amenities?.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What's Included</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {listing.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                        <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Map */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Location</h2>
                <div className="h-96 rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800">
                  <MapContainer
                    center={[listing.lat, listing.lng]}
                    zoom={15}
                    className="h-full w-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="© OpenStreetMap contributors"
                    />
                    <Marker position={[listing.lat, listing.lng]}>
                      <Popup>
                        <strong>{listing.name}</strong>
                        <br />
                        {listing.location}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 shadow-lg">
                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-gray-200 dark:border-neutral-800">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{listing.price}</span>
                      <span className="text-lg text-gray-500 dark:text-gray-400">/day</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Best price guaranteed</p>
                  </div>

                  {/* Booking Form */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Duration
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 transition">
                        <option>Half Day (4 hours)</option>
                        <option>Full Day (8 hours)</option>
                        <option>Multiple Days</option>
                      </select>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-neutral-800">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>₹{listing.price} × 1 day</span>
                      <span>₹{listing.price}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Service fee</span>
                      <span>₹{Math.round(listing.price * 0.1)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{listing.price + Math.round(listing.price * 0.1)}</span>
                  </div>

                  {/* CTA Buttons */}
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-md mb-3"
                  >
                    Request Booking
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Replace with proper contact modal when backend supports it
                      window.open(`mailto:info@eduspace.in?subject=Inquiry about ${listing.name}&body=Hi, I am interested in booking this space.`);
                    }}
                    className="w-full border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                  >
                    Contact Owner
                  </button>

                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                    You won't be charged yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        listing={listing}
      />

      <Footer />
    </>
  );
}
