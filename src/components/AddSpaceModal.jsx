import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { listingsAPI } from "../services/api";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const SPACE_TYPES = [
  { value: "Classroom", label: "Classroom", icon: "📚" },
  { value: "Laboratory", label: "Laboratory", icon: "🔬" },
  { value: "Auditorium", label: "Auditorium", icon: "🎭" },
  { value: "Sports Hall", label: "Sports Hall", icon: "🏀" },
  { value: "Library", label: "Library", icon: "📖" },
  { value: "Conference Room", label: "Conference Room", icon: "🤝" },
];

const AMENITIES = [
  "AC", "WiFi", "Projector", "Whiteboard", "Smart Board",
  "Sound System", "Stage", "Parking", "Furniture", "Video Conferencing",
  "Computers", "First Aid", "Changing Rooms", "Storage", "CCTV"
];

const AVAILABILITY_OPTIONS = [
  "Weekends Only",
  "Sundays Only",
  "Holidays Only",
  "Weekends & Holidays",
  "Sundays & Holidays",
  "Weekends & Vacations",
  "All Days (After School Hours)",
  "Custom Schedule"
];

// Component for clicking to pick location on map
function LocationPicker({ position, onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });

  return position ? <Marker position={position} /> : null;
}

export default function AddSpaceModal({ isOpen, onClose, onSuccess }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    spaceType: "",
    description: "",
    capacity: "",
    price: "",
    location: "",
    city: "Mumbai",
    amenities: [],
    availability: "",
    customAvailability: "",
    imageUrl1: "",
    imageUrl2: "",
    imageUrl3: "",
    lat: "",
    lng: "",
    googleMapsLink: ""
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError("");
      setFormData({
        name: "",
        spaceType: "",
        description: "",
        capacity: "",
        price: "",
        location: "",
        city: "Mumbai",
        amenities: [],
        availability: "",
        customAvailability: "",
        imageUrl1: "",
        imageUrl2: "",
        imageUrl3: "",
        lat: "",
        lng: "",
        googleMapsLink: ""
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const validateStep = (stepNum) => {
    switch (stepNum) {
      case 1:
        if (!formData.name.trim()) return "Please enter a space name";
        if (!formData.spaceType) return "Please select a space type";
        if (!formData.description.trim()) return "Please add a description";
        return null;
      case 2:
        if (!formData.capacity || parseInt(formData.capacity) < 1) return "Please enter valid capacity";
        if (!formData.price || parseInt(formData.price) < 100) return "Price must be at least ₹100";
        if (formData.amenities.length === 0) return "Please select at least one amenity";
        return null;
      case 3:
        if (!formData.location.trim()) return "Please enter the address";
        if (!formData.availability) return "Please select availability";
        if (formData.availability === "Custom Schedule" && !formData.customAvailability.trim()) {
          return "Please describe your custom schedule";
        }
        return null;
      default:
        return null;
    }
  };

  const nextStep = () => {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    const validationError = validateStep(3);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Map availability to backend enum ('Weekdays', 'Weekends', 'Both')
      const mapAvailability = (avail) => {
        if (avail.includes("Weekends") && avail.includes("Holidays")) return "Both";
        if (avail.includes("Weekends") || avail.includes("Sundays")) return "Weekends";
        return "Weekdays";
      };

      // Collect all non-empty image URLs
      const images = [formData.imageUrl1, formData.imageUrl2, formData.imageUrl3]
        .filter(url => url && url.trim())
        .map(url => url.trim());

      const payload = {
        name: formData.name.trim(),
        spaceType: formData.spaceType,
        description: formData.description.trim(),
        capacity: parseInt(formData.capacity),
        price: parseInt(formData.price),
        location: `${formData.location.trim()}, ${formData.city}`,
        amenities: formData.amenities,
        availability: mapAvailability(formData.availability === "Custom Schedule"
          ? formData.customAvailability
          : formData.availability),
        images: images.length > 0
          ? images
          : ["https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"],
        coordinates: {
          lat: formData.lat ? parseFloat(formData.lat) : 19.076 + Math.random() * 0.2,
          lng: formData.lng ? parseFloat(formData.lng) : 72.877 + Math.random() * 0.1
        }
      };

      await listingsAPI.create(payload);

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to create listing";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Space</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Step {step} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-gray-700"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>

                {/* Space Name */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Space Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., ABC School - Science Lab"
                    className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 transition"
                  />
                </div>

                {/* Space Type */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Space Type *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {SPACE_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, spaceType: type.value })}
                        className={`p-4 border-2 rounded-xl transition text-center ${formData.spaceType === type.value
                          ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-700"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-400"
                          }`}
                      >
                        <div className="text-2xl mb-1">{type.icon}</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your space, what makes it special, equipment available, etc."
                    className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 transition resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details & Amenities */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details & Amenities</h3>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  {/* Capacity */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Capacity (people) *
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      min="1"
                      placeholder="e.g., 40"
                      className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 transition"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Price per Day (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="100"
                      step="100"
                      placeholder="e.g., 1500"
                      className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 transition"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Amenities * <span className="font-normal text-gray-500">(Select all that apply)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-4 py-2 border-2 rounded-full text-sm font-medium transition ${formData.amenities.includes(amenity)
                          ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                          : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400"
                          }`}
                      >
                        {formData.amenities.includes(amenity) && (
                          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image URLs */}
                <div className="mt-5">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Image URLs <span className="font-normal text-gray-500">(Optional — up to 3 images)</span>
                  </label>
                  <div className="space-y-3">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-5 shrink-0">{num}</span>
                        <input
                          type="url"
                          name={`imageUrl${num}`}
                          value={formData[`imageUrl${num}`]}
                          onChange={handleChange}
                          placeholder={num === 1 ? "Main image URL (required for best results)" : `Image ${num} URL`}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 transition text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Leave all empty to use a default image. The listing detail page shows 3 images.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location & Availability */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location & Availability</h3>

                {/* Address */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Andheri West"
                    className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 transition"
                  />
                </div>

                {/* City */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    City
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 transition"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                </div>

                {/* Availability */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Availability *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {AVAILABILITY_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData({ ...formData, availability: option })}
                        className={`p-3 border-2 rounded-xl text-sm font-medium transition text-left ${formData.availability === option
                          ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-700"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-400"
                          }`}
                      >
                        <span className="text-gray-900 dark:text-white">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Schedule */}
                {formData.availability === "Custom Schedule" && (
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Describe Your Schedule *
                    </label>
                    <textarea
                      name="customAvailability"
                      value={formData.customAvailability}
                      onChange={handleChange}
                      rows={3}
                      placeholder="e.g., Saturdays 2PM-8PM, Sundays 9AM-6PM, All holidays"
                      className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 transition resize-none"
                    />
                  </div>
                )}

                {/* Location Picker */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    📍 Pin Location on Map <span className="font-normal text-gray-500">(Click to set or paste Google Maps link)</span>
                  </label>

                  {/* Google Maps Link */}
                  <input
                    type="url"
                    name="googleMapsLink"
                    value={formData.googleMapsLink}
                    onChange={(e) => {
                      const link = e.target.value;
                      setFormData(prev => ({ ...prev, googleMapsLink: link }));

                      // Parse coordinates from Google Maps links
                      // Supports formats: 
                      //   https://maps.google.com/?q=19.076,72.877
                      //   https://www.google.com/maps/@19.076,72.877,15z
                      //   https://goo.gl/maps/...
                      //   https://maps.app.goo.gl/...
                      const patterns = [
                        /@(-?\d+\.\d+),(-?\d+\.\d+)/,
                        /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,
                        /place\/[^/]+\/@(-?\d+\.\d+),(-?\d+\.\d+)/,
                        /ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
                      ];

                      for (const pattern of patterns) {
                        const match = link.match(pattern);
                        if (match) {
                          setFormData(prev => ({
                            ...prev,
                            googleMapsLink: link,
                            lat: match[1],
                            lng: match[2]
                          }));
                          break;
                        }
                      }
                    }}
                    placeholder="Paste Google Maps link here..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-gray-900 transition text-sm mb-3"
                  />

                  {/* Interactive Map */}
                  <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600" style={{ height: "250px" }}>
                    <MapContainer
                      center={[
                        formData.lat ? parseFloat(formData.lat) : 19.076,
                        formData.lng ? parseFloat(formData.lng) : 72.877
                      ]}
                      zoom={12}
                      className="h-full w-full"
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="© OpenStreetMap"
                      />
                      <LocationPicker
                        position={
                          formData.lat && formData.lng
                            ? [parseFloat(formData.lat), parseFloat(formData.lng)]
                            : null
                        }
                        onLocationSelect={(lat, lng) => {
                          setFormData(prev => ({ ...prev, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
                        }}
                      />
                    </MapContainer>
                  </div>

                  {formData.lat && formData.lng ? (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Location set: {parseFloat(formData.lat).toFixed(4)}, {parseFloat(formData.lng).toFixed(4)}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-2">Click on the map or paste a Google Maps link to set location. Leave empty to auto-generate.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                disabled={loading}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition flex items-center gap-2"
              >
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Listing
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

