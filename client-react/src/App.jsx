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
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Newly added components for template selection and template-specific posting
import TemplateSelector from './pages/TemplateSelector';
import CreatorGeneralForm from './pages/CreatorGeneralForm';
import CreatorImageTopForm from './pages/CreatorImageTopForm';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppNavbar />
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<SignIn />} />

          {/* Admin Routes */}
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

          {/* Creator Routes */}

          {/* Template Selection (navigation page) */}
          <Route
            path="/creator/create"
            element={
              <ProtectedRoute>
                <TemplateSelector />
              </ProtectedRoute>
            }
          />

          {/* Posting creation: General Template */}
          <Route
            path="/creator/create/general"
            element={
              <ProtectedRoute>
                <CreatorGeneralForm />
              </ProtectedRoute>
            }
          />

          {/* Posting creation: Image Top Template */}
          <Route
            path="/creator/create/imagetop"
            element={
              <ProtectedRoute>
                <CreatorImageTopForm />
              </ProtectedRoute>
            }
          />

          {/* Creator Postings List */}
          <Route
            path="/creator/list"
            element={
              <ProtectedRoute>
                <CreatorPostingList />
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


          {/* Portfolio Editing */}
          <Route
            path="/edit-portfolio"
            element={
              <ProtectedRoute>
                <EditPortfolio />
              </ProtectedRoute>
            }
          />

          {/* Recipe Details */}
          <Route
            path="/recipes/:id"
            element={
              <ProtectedRoute>
                <RecipeDetail />
              </ProtectedRoute>
            }
          />

          {/* All Recipes List */}
          <Route
            path="/recipes"
            element={
              <ProtectedRoute>
                <RecipeList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
