import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login(username, password);

      if (response.data.success) {
        // Store user info in localStorage
        const user = (response.data as any).user;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          // Dispatch storage event to notify other parts of the app
          window.dispatchEvent(new Event('storage'));
        }
        toast.success('Login successful!');
        // Navigate after a brief delay to allow state updates
        setTimeout(() => {
          navigate('/');
        }, 100);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg">
            <span className="text-3xl">📦</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">Purchase Order</h1>
          <p className="text-primary-100 text-sm mt-2">Manage your orders efficiently</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Login</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  placeholder-neutral-400 transition"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    placeholder-neutral-400 transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-700"
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white 
                font-medium py-3 rounded-lg hover:shadow-lg transition duration-200
                disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-primary-100 text-xs mt-6">
          © 2025 Purchase Order System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
