import axios from "axios";

const getApiBaseUrl = () => {
  return (
    import.meta?.env?.VITE_API_URL ||
    import.meta?.env?.VITE_BACKEND_URL ||
    "http://localhost:5000/api"
  );
};

const client = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json"
  }
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("eduSpaceToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  cancel: (id) => client.put(`/bookings/${id}/cancel`)
};

export default client;
