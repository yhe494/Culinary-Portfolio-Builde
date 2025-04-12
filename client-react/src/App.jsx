import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';

import AdminPanel from './pages/AdminPanel';
import AdminTemplateCreate from './pages/AdminTemplateCreate';
import AdminTemplateList from './pages/AdminTemplateList';
import AppNavbar from './components/Navbar';
import CreatorPostingCreate from './pages/CreatorPostingCreate';
import CreatorPostingList from './pages/CreatorPostingList';
import EditPortfolio from './components/EditPortfolio';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import UserProfile from './components/UserProfile';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import EditPosting from './components/EditPosting';

import TemplateSelector from './pages/TemplateSelector';
import CreatorGeneralForm from './pages/CreatorGeneralForm';
import CreatorImageTopForm from './pages/CreatorImageTopForm';
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppNavbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<SignIn />} />

          {/* Admin */}
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
          <Route
            path="/admin/templates"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminTemplateList />
              </ProtectedRoute>
            }
          />

          {/* Creator - Posting Creation Flow */}
          <Route
            path="/creator/create"
            element={
              <ProtectedRoute>
                <TemplateSelector />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creator/create/general"
            element={
              <ProtectedRoute>
                <CreatorGeneralForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creator/create/imagetop"
            element={
              <ProtectedRoute>
                <CreatorImageTopForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creator/postings"
            element={
              <ProtectedRoute>
                <CreatorPostingList />
              </ProtectedRoute>
            }
          />

          {/* Portfolio - My Profile */}
          <Route
            path="/edit-portfolio"
            element={
              <ProtectedRoute>
                <EditPortfolio />
              </ProtectedRoute>
            }
          />

          {/* Link from Navbar: /portfolio → redirect to /edit-portfolio */}
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <EditPortfolio />
              </ProtectedRoute>
            }
          />

          {/* User Profile Page */}
          <Route
            path="/user-profile/:userId"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-post/:id"
            element={
              <ProtectedRoute>
                <EditPosting />
              </ProtectedRoute>
            }
          />

          {/* Community Page (Placeholder) */}
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <div className="container mt-4">
                  <h2>🧑‍🤝‍🧑 Community Page (Coming Soon)</h2>
                  <p>Here you can add forum, discussion, or shared templates in the future.</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Recipes */}
          <Route
            path="/recipes"
            element={
              <ProtectedRoute>
                <RecipeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes/:id"
            element={
              <ProtectedRoute>
                <RecipeDetail />
              </ProtectedRoute>
            }
          />
          
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;