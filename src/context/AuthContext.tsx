
import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  getCurrentUser: () => string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Daftar akun admin (bisa dikembangkan ke backend nantinya)
const ADMIN_USERS = [
  { username: "Rizki", password: "admin123" },
  { username: "Oki", password: "admin456" },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    const currentUser = localStorage.getItem("currentUser");
    if (adminAuth === "true" && currentUser) {
      setIsAdmin(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const user = ADMIN_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setIsAdmin(true);
      localStorage.setItem("adminAuth", "true");
      localStorage.setItem("currentUser", username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("currentUser");
  };

  const getCurrentUser = () => {
    return localStorage.getItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
