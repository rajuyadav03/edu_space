/**
 * Application-wide constants
 * Centralized configuration for magic values
 */

// Default map center (Mumbai, India)
export const DEFAULT_MAP_CENTER = {
    lat: 19.076,
    lng: 72.8777
};

export const DEFAULT_MAP_ZOOM = 11;

// API/Backend configuration
export const API_BASE_URL =
    import.meta?.env?.VITE_API_URL ||
    import.meta?.env?.VITE_BACKEND_URL ||
    "http://localhost:5000/api";

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;

// Price range defaults
export const PRICE_RANGE = {
    min: 0,
    max: 5000
};

// Space types for filtering
export const SPACE_TYPES = [
    "All",
    "Classroom",
    "Laboratory",
    "Auditorium",
    "Sports Hall"
];
