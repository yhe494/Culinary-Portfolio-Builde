import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token'); // Check for stored token

      if (token) {
        try {
          const decodedUser = jwtDecode(token); // Decode user info from token
          setUser(decodedUser);
         console.log("This is decodedUser" +decodedUser);
          // Redirect based on role
          if (decodedUser.isAdmin && window.location.pathname === '/admin') {
            // Stay on admin page
          } else if (decodedUser.isAdmin) {
            navigate('/admin');
          } else {
            navigate('/student');
          }
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('token');
          setUser(null);
          navigate('/');
        }
      } else {
        setUser(null);
        navigate('/');
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const signOut = () => {
    localStorage.removeItem('token'); // Clear token
    setUser(null);
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};