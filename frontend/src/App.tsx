import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ModuleListPage from './pages/ModuleListPage';
import ModuleFormPage from './pages/ModuleFormPage';
import ModuleDetailPage from './pages/ModuleDetailPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App bg-white dark:bg-dark-primary transition-colors duration-200">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Module routes */}
              <Route 
                path="/modules" 
                element={
                  <ProtectedRoute>
                    <ModuleListPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/modules/new" 
                element={
                  <ProtectedRoute requiredRoles={['instructor', 'admin']}>
                    <ModuleFormPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/modules/:id" 
                element={
                  <ProtectedRoute>
                    <ModuleDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/modules/:id/edit" 
                element={
                  <ProtectedRoute requiredRoles={['instructor', 'admin']}>
                    <ModuleFormPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 