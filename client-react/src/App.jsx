import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';

import AdminPanel from './pages/AdminPanel';
import AdminTemplateCreate from './pages/AdminTemplateCreate';
import AdminTemplateList from './pages/AdminTemplateList';
import AppNavbar from './components/Navbar';
import CreatorPostingCreate from './pages/CreatorPostingCreate';
import CreatorPostingList from './pages/CreatorPostingList';
import EditPortfolio from './components/EditPortfolio'; // Imported EditPortfolio component
// import ViewPortfolio from './components/ViewPortfolio'; // Imported ViewPortfolio component
import RecipeList from './components/RecipeList';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppNavbar />
        <Routes>
          {/* Public */}
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
          <Route
            path="/creator/create"
            element={
              <ProtectedRoute>
                <CreatorPostingCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creator/list"
            element={
              <ProtectedRoute>
                <CreatorPostingList />
              </ProtectedRoute>
            }
          />

          {/* Edit Portfolio Route */}
          <Route
            path="/edit-portfolio"
            element={
              <ProtectedRoute>
                <EditPortfolio />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/view-portfolio"
            element={
           <ProtectedRoute>
            <ViewPortfolio />
             </ProtectedRoute>
         }
        /> */}

          <Route 
            path="/recipes" 
            element={
              <ProtectedRoute>
                <RecipeList />
              </ProtectedRoute>
          } />
          </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;