import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../lib/constants";

const AuthContext = createContext(null);

const STORAGE_TOKEN_KEY = "eduSpaceToken";
const STORAGE_USER_KEY = "eduSpaceUser";

// Helper: get from either localStorage or sessionStorage
const getStored = (key) => {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY) || sessionStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Helper: clear from both storages
const clearStored = (key) => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

authClient.interceptors.request.use((config) => {
  const token = getStored(STORAGE_TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStored(STORAGE_TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(token);

  // rememberMe = true → localStorage (persists), false → sessionStorage (clears on close)
  const persistAuth = (nextToken, nextUser, remember = true) => {
    const storage = remember ? localStorage : sessionStorage;

    // Always clear both first to avoid stale data in the other storage
    clearStored(STORAGE_TOKEN_KEY);
    clearStored(STORAGE_USER_KEY);

    if (nextToken) {
      storage.setItem(STORAGE_TOKEN_KEY, nextToken);
      setToken(nextToken);
    } else {
      setToken(null);
    }

    if (nextUser) {
      storage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
    } else {
      setUser(null);
    }
  };

  const refreshMe = async () => {
    const storedToken = getStored(STORAGE_TOKEN_KEY);
    if (!storedToken) {
      return { success: false };
    }

    try {
      const res = await authClient.get("/auth/me");
      const me = res?.data?.user || res?.data;
      if (me) {
        // Keep in whichever storage it was already in
        const isInLocal = Boolean(localStorage.getItem(STORAGE_TOKEN_KEY));
        persistAuth(storedToken, me, isInLocal);
        return { success: true, user: me };
      }
      return { success: false };
    } catch {
      persistAuth(null, null);
      return { success: false };
    }
  };

  useEffect(() => {
    const boot = async () => {
      setLoading(true);
      if (getStored(STORAGE_TOKEN_KEY)) {
        await refreshMe();
      }
      setLoading(false);
    };

    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password, rememberMe = true) => {
    try {
      const res = await authClient.post("/auth/login", { email, password });
      const nextToken = res?.data?.token;
      const nextUser = res?.data?.user;

      if (!nextToken || !nextUser) {
        return { success: false, message: res?.data?.message || "Login failed" };
      }

      persistAuth(nextToken, nextUser, rememberMe);
      return { success: true, user: nextUser, token: nextToken };
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authClient.post("/auth/register", userData);
      const nextToken = res?.data?.token;
      const nextUser = res?.data?.user;

      if (!nextToken || !nextUser) {
        return { success: false, message: res?.data?.message || "Registration failed" };
      }

      persistAuth(nextToken, nextUser, true);
      return { success: true, user: nextUser, token: nextToken };
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed";
      return { success: false, message };
    }
  };

  const logout = () => {
    persistAuth(null, null);
  };

  const forgotPassword = async (email) => {
    try {
      const res = await authClient.post("/auth/forgot-password", { email });
      return { success: true, message: res?.data?.message };
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to send reset email";
      return { success: false, message };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const res = await authClient.put(`/auth/reset-password/${token}`, { password });
      const nextToken = res?.data?.token;
      const nextUser = res?.data?.user;

      if (nextToken && nextUser) {
        persistAuth(nextToken, nextUser, true);
      }

      return { success: true, user: nextUser, message: res?.data?.message };
    } catch (err) {
      const message = err?.response?.data?.message || "Password reset failed";
      return { success: false, message };
    }
  };

  const persistAuthFromGoogle = (googleToken, googleUser) => {
    persistAuth(googleToken, googleUser, true);
  };

  // Functions are stable and don't need to be in deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      refreshMe,
      forgotPassword,
      resetPassword,
      persistAuthFromGoogle
    }),
    [user, token, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
