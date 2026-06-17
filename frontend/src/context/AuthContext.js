/*import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); */

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Manage login state across the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if login data exists
  const [loading, setLoading] = useState(true);

  // Load saved user from local storage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {

      // Login check finished
      setLoading(false);
    }
  }, []);

  // Save user login data
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Remove user login data
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Easy way to use auth context
export const useAuth = () => useContext(AuthContext);
