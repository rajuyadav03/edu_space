import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../lib/constants";

const AuthContext = createContext(null);

const STORAGE_TOKEN_KEY = "eduSpaceToken";
const STORAGE_USER_KEY = "eduSpaceUser";

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
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
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(token);

  const persistAuth = (nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(STORAGE_TOKEN_KEY, nextToken);
      setToken(nextToken);
    } else {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      setToken(null);
    }

    if (nextUser) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
      setUser(null);
    }
  };

  const refreshMe = async () => {
    if (!localStorage.getItem(STORAGE_TOKEN_KEY)) {
      return { success: false };
    }

    try {
      const res = await authClient.get("/auth/me");
      const me = res?.data?.user || res?.data;
      if (me) {
        persistAuth(localStorage.getItem(STORAGE_TOKEN_KEY), me);
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
      if (localStorage.getItem(STORAGE_TOKEN_KEY)) {
        await refreshMe();
      }
      setLoading(false);
    };

    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authClient.post("/auth/login", { email, password });
      const nextToken = res?.data?.token;
      const nextUser = res?.data?.user;

      if (!nextToken || !nextUser) {
        return { success: false, message: res?.data?.message || "Login failed" };
      }

      persistAuth(nextToken, nextUser);
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

      persistAuth(nextToken, nextUser);
      return { success: true, user: nextUser, token: nextToken };
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed";
      return { success: false, message };
    }
  };

  const logout = () => {
    persistAuth(null, null);
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
      refreshMe
    }),
    [user, token, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
