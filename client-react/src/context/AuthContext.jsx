import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage first
    const token = localStorage.getItem('token');
    
    const checkAuth = async () => {
      try {
        // If we have a token, add it to the request headers
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('http://localhost:5001/read_cookie', {
          credentials: 'include', // Ensure cookies are included in the request
          headers: headers
        });
        
        const data = await response.json();
        
        if (response.ok && data.user) {
          // Make sure we have an id property
          const userData = {
            ...data.user,
            id: data.user.id || data.user._id, // Handle possible naming differences
            token: token || data.token // Use token from localStorage or response
          };
          
          console.log('Auth context user data:', userData);
          setUser(userData);

          // If user is admin, redirect appropriately
          if (data.user.isAdmin && window.location.pathname === '/admin') {
            // Stay on admin page
          } else if (data.user.isAdmin) {
            navigate('/admin');
          } else if (window.location.pathname === '/') {
            navigate('/student');
          }
        } else {
          console.log('No user data from server or unauthorized');
          setUser(null);
          if (window.location.pathname !== '/') {
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const signOut = async () => {
    try {
      const response = await fetch('http://localhost:5001/signout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        localStorage.removeItem('token'); // Clear the token
        setUser(null);
        navigate('/');
      } else {
        console.error('Sign-out failed');
      }
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
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