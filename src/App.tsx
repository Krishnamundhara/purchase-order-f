import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import CreatePO from './pages/CreatePO';
import EditPO from './pages/EditPO';
import CompanySettings from './components/CompanySettings';

const App: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
          {/* Header */}
          <header className="border-b border-neutral-200 bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600">
                    <span className="text-lg font-bold text-white">📦</span>
                  </div>
                  <h1 className="text-2xl font-bold text-primary-900">Purchase Order System</h1>
                </div>

                {/* Settings Button */}
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2 text-neutral-700
                    hover:bg-neutral-200 transition duration-200"
                  title="Company Settings"
                >
                  <span>⚙️</span>
                  <span className="text-sm font-medium">Settings</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create" element={<CreatePO />} />
              <Route path="/edit/:id" element={<EditPO />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="border-t border-neutral-200 bg-white py-6 text-center text-sm text-neutral-600">
            <p>© 2025 Purchase Order System. All rights reserved.</p>
          </footer>
        </div>
      </Router>

      {/* Settings Modal */}
      <CompanySettings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </>
  );
};

export default App;
