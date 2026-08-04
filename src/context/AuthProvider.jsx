// src/context/AuthProvider.jsx
import { useState } from "react";
import { AuthContext } from "./AuthContext";
import authService from "../services/authService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  );

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(authService.getCurrentUser());
    setIsAuthenticated(true);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
