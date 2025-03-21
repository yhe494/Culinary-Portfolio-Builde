import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5001/read_cookie', {
          credentials: 'include',
        });
        const data = await response.json();

        if (response.ok && data.user) {
          setUser(data.user);

          const isAdmin = data.user.isAdmin;
          const currentPath = window.location.pathname;

          if (isAdmin && currentPath.startsWith("/admin")) {
            // stay on admin subpaths
          } else if (isAdmin) {
            navigate("/admin");
          } 
          // ❌ Removed student handling
          else if (currentPath.startsWith("/creator")) {
            // stay on creator subpaths
          } else {
            navigate("/creator/list"); // ✅ Default route for creators
          }

        } else {
          setUser(null);
          navigate('/');
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
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
