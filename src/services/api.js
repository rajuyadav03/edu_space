import axios from "axios";
import { API_BASE_URL } from "../lib/constants";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("eduSpaceToken") || sessionStorage.getItem("eduSpaceToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401 responses (expired or invalid token)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear auth from both storages
      localStorage.removeItem("eduSpaceToken");
      localStorage.removeItem("eduSpaceUser");
      sessionStorage.removeItem("eduSpaceToken");
      sessionStorage.removeItem("eduSpaceUser");

      // Redirect to login (only if not already there)
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const listingsAPI = {
  getAll: (params) => client.get("/listings", { params }),
  getOne: (id) => client.get(`/listings/${id}`),
  getMyListings: () => client.get("/listings/my-listings"),
  create: (payload) => client.post("/listings", payload),
  update: (id, payload) => client.put(`/listings/${id}`, payload),
  remove: (id) => client.delete(`/listings/${id}`)
};

export const bookingsAPI = {
  create: (payload) => client.post("/bookings", payload),
  getMyBookings: () => client.get("/bookings/my-bookings"),
  getRequests: () => client.get("/bookings/requests"),
  getOne: (id) => client.get(`/bookings/${id}`),
  updateStatus: (id, status) => client.put(`/bookings/${id}/status`, { status }),
  cancel: (id) => client.put(`/bookings/${id}/cancel`),
  resolveDeposit: (id, data) => client.put(`/bookings/${id}/deposit`, data)
};

export const adminAPI = {
  getStats: () => client.get("/admin/stats"),
  getUsers: (params) => client.get("/admin/users", { params }),
  deleteUser: (id) => client.delete(`/admin/users/${id}`),
  getListings: (params) => client.get("/admin/listings", { params }),
  deleteListing: (id) => client.delete(`/admin/listings/${id}`),
  getBookings: (params) => client.get("/admin/bookings", { params }),
  updateBookingStatus: (id, status) => client.put(`/admin/bookings/${id}/status`, { status }),
  deleteBooking: (id) => client.delete(`/admin/bookings/${id}`)
};

export const userAPI = {
  getProfile: () => client.get("/users/profile"),
  updateProfile: (data) => client.put("/users/profile", data),
  submitKYC: (data) => client.put("/users/kyc", data),
  getPendingKYC: () => client.get("/users/kyc/pending"),
  verifyKYC: (userId, data) => client.put(`/users/kyc/${userId}/verify`, data)
};

export const favoritesAPI = {
  getAll: () => client.get("/users/favorites"),
  add: (listingId) => client.post(`/users/favorites/${listingId}`),
  remove: (listingId) => client.delete(`/users/favorites/${listingId}`)
};

export default client;
