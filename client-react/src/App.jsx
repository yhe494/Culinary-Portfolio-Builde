import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import AdminTemplateCreate from './pages/AdminTemplateCreate';
import AdminTemplateList from './pages/AdminTemplateList';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
         
          <Route
            path="/admin/create"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminTemplateCreate />
              </ProtectedRoute>
            }
          />
          
          {/* Template List - Amin only */}
          <Route
            path="/admin/templates"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminTemplateList />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentPage />
              </ProtectedRoute>
            }
          />*/}
        </Routes> 
      </AuthProvider>
    </Router>
  );
};

export default App;