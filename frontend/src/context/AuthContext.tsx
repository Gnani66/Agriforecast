"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

interface UserData {
  _id: string;
  name: string;
  email: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  role: string | null;
  login: (data: Record<string, unknown>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const storedRole = localStorage.getItem("role");

      if (storedToken) setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }
      if (storedRole) setRole(storedRole);
      setHydrated(true);
    });
  }, []);

  const login = useCallback((data: Record<string, unknown>) => {
    const userKey = data.retailer ? "retailer" : data.distributor ? "distributor" : "farmer";
    const userData = (data.retailer || data.distributor || data.farmer) as UserData;
    const authToken = data.token as string;

    setUser(userData);
    setToken(authToken);
    setRole(userKey);

    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userKey);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
