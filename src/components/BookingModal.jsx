import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bookingsAPI } from "../services/api";

export default function BookingModal({ isOpen, onClose, listing }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    date: "",
    duration: "full",
    purpose: "",
    attendees: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ date: "", duration: "full", purpose: "", attendees: "" });
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  // Calculate price based on duration
  const calculatePrice = () => {
    const basePrice = listing?.price || 0;
    const multiplier = formData.duration === "half" ? 0.6 : 1;
    const price = Math.round(basePrice * multiplier);
    const serviceFee = Math.round(price * 0.1);
    return { price, serviceFee, total: price + serviceFee };
  };

  const { price, serviceFee, total } = calculatePrice();

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.date) {
      setError("Please select a date");
      return;
    }
    if (!formData.purpose) {
      setError("Please describe the purpose of booking");
      return;
    }
    if (!formData.attendees || parseInt(formData.attendees) < 1) {
      setError("Please enter expected number of attendees");
      return;
    }
    if (parseInt(formData.attendees) > listing?.capacity) {
      setError(`Attendees cannot exceed capacity of ${listing?.capacity}`);
      return;
    }

    setLoading(true);

    try {
      // Map frontend fields to backend expected fields
      const timeSlot = formData.duration === "full"
        ? "Full Day"
        : "Half Day (Morning)";

      const payload = {
        listingId: listing?.id || listing?._id,
        bookingDate: formData.date,
        timeSlot: timeSlot,
        purpose: formData.purpose,
        numberOfStudents: parseInt(formData.attendees),
        specialRequirements: ""
      };

      await bookingsAPI.create(payload);
      setSuccess(true);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to submit booking request";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Not logged in state
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Login Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Please sign in to your account to book this space.
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition text-center"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block w-full border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Schools cannot book
  if (user?.role === "school") {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">School Account</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              School accounts are for listing spaces, not booking. Please use a teacher account to make bookings.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Request Submitted!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Your booking request has been sent to the space owner. You'll receive a notification once they respond.
            </p>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 mb-6 text-left">
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={listing?.image}
                  alt={listing?.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{listing?.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{listing?.location}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-200 dark:border-gray-600 pt-3">
                <span className="text-gray-600 dark:text-gray-400">Date</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(formData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">Duration</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.duration === "full" ? "Full Day" : "Half Day"}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">Total</span>
                <span className="font-bold text-gray-900 dark:text-white">₹{total}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/teacher-dashboard")}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition"
              >
                View My Bookings
              </button>
              <button
                onClick={onClose}
                className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main booking form
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Request Booking</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Listing Info */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <img
              src={listing?.image || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"}
              alt={listing?.name || "Space"}
              className="w-20 h-20 rounded-xl object-cover"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"; }}
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">{listing?.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {listing?.location}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {listing?.spaceType} • {listing?.capacity} capacity
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Select Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={getMinDate()}
                disabled={loading}
                required
                className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 transition disabled:opacity-50"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Duration *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, duration: "half" })}
                  disabled={loading}
                  className={`p-4 border-2 rounded-xl transition text-left ${formData.duration === "half"
                      ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-700"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-400"
                    }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">Half Day</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">4 hours</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    ₹{Math.round((listing?.price || 0) * 0.6)}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, duration: "full" })}
                  disabled={loading}
                  className={`p-4 border-2 rounded-xl transition text-left ${formData.duration === "full"
                      ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-700"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-400"
                    }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">Full Day</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">8 hours</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    ₹{listing?.price}
                  </div>
                </button>
              </div>
            </div>

            {/* Attendees */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Expected Attendees *
              </label>
              <input
                type="number"
                name="attendees"
                value={formData.attendees}
                onChange={handleChange}
                min="1"
                max={listing?.capacity}
                placeholder={`Max ${listing?.capacity} people`}
                disabled={loading}
                required
                className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 transition disabled:opacity-50"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Purpose of Booking *
              </label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={3}
                placeholder="e.g., Tuition classes for 10th grade students, Workshop, Training session..."
                disabled={loading}
                required
                className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 transition resize-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Price Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Space rental ({formData.duration === "full" ? "Full day" : "Half day"})</span>
                <span>₹{price}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Service fee</span>
                <span>₹{serviceFee}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting Request...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Submit Booking Request
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            You won't be charged until the owner approves your request
          </p>
        </form>
      </div>
    </div>
  );
}
