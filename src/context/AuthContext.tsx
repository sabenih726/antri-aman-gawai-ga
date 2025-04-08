
import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Password admin sederhana - dalam aplikasi produksi seharusnya menggunakan sistem yang lebih aman
const ADMIN_PASSWORD = "admin123";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Periksa status autentikasi saat aplikasi dimuat
  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth === "true") {
      setIsAdmin(true);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem("adminAuth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("adminAuth");
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
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
