import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import CreatePO from './pages/CreatePO';
import EditPO from './pages/EditPO';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CompanySettings from './components/CompanySettings';
import { authApi } from './services/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
}

const ProtectedRoute: React.FC<{ children: React.ReactNode; user: User | null }> = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    
    // Listen for storage changes (login/logout from other tabs or components)
    const handleStorageChange = () => {
      checkAuth();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkAuth = async () => {
    try {
      // Check if user data is in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Try to get current user from backend
        const response = await authApi.getMe();
        if (response.data.success && (response.data as any).user) {
          const userData = (response.data as any).user;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (error) {
      // Not authenticated, clear localStorage
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <span className="text-4xl animate-spin">⏳</span>
          </div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
          {/* Header - Only show if authenticated */}
          {user && (
            <header className="border-b border-neutral-200 bg-white shadow-sm">
              <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600">
                      <span className="text-lg font-bold text-white">📦</span>
                    </div>
                    <h1 className="text-2xl font-bold text-primary-900">Purchase Order System</h1>
                  </div>

                  {/* User Menu */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-900">{user.full_name || user.username}</p>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>

                    {/* Settings Button */}
                    <button
                      onClick={() => setSettingsOpen(true)}
                      className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-neutral-700
                        hover:bg-neutral-200 transition duration-200"
                      title="Company Settings"
                    >
                      <span>⚙️</span>
                    </button>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-red-700
                        hover:bg-red-200 transition duration-200"
                      title="Logout"
                    >
                      <span>🚪</span>
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Main Content */}
          <main className={user ? 'mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8' : ''}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute user={user}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <ProtectedRoute user={user}>
                    <CreatePO />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute user={user}>
                    <EditPO />
                  </ProtectedRoute>
                }
              />

              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
            </Routes>
          </main>

          {/* Footer - Only show if authenticated */}
          {user && (
            <footer className="border-t border-neutral-200 bg-white py-6 text-center text-sm text-neutral-600">
              <p>© 2025 Purchase Order System. All rights reserved.</p>
            </footer>
          )}
        </div>
      </Router>

      {/* Settings Modal - Only show if authenticated */}
      {user && <CompanySettings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />}

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </>
  );
};

export default App;
