import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0e11] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#1e2329] p-10 rounded-xl border border-[#2b3139] shadow-2xl">
        <div>
          <h1 className="text-center text-3xl font-bold text-[#f0b90b] tracking-tight">
            TRADEVAULT
          </h1>
          <h2 className="mt-6 text-center text-xl font-bold text-[#eaecef]">
            Log In
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-[#f6465d]/10 border border-[#f6465d] text-[#f6465d] px-4 py-3 rounded text-sm italic">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#848e9c] mb-1">
                Username or Email
              </label>
              <input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                required
                className="w-full bg-[#0b0e11] border border-[#2b3139] focus:border-[#f0b90b] rounded px-4 py-3 text-[#eaecef] outline-none transition-all placeholder-[#474d57]"
                placeholder="Enter your username"
                value={formData.usernameOrEmail}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#848e9c] mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-[#0b0e11] border border-[#2b3139] focus:border-[#f0b90b] rounded px-4 py-3 text-[#eaecef] outline-none transition-all placeholder-[#474d57]"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded font-bold text-black bg-[#f0b90b] hover:bg-[#fcd535] transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>

          <div className="text-center text-sm text-[#848e9c]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-[#f0b90b] hover:underline transition-all"
            >
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
