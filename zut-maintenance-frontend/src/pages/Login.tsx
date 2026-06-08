import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/axios';
import { WrenchIcon, AlertCircleIcon } from 'lucide-react';
export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      login(response.data.token, response.data.user);
      navigate(response.data.user.role === 'admin' ? '/dashboard' : '/my-reports', {
        replace: true
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Failed to login. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <WrenchIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-slate-900">
            ZUT Maintenance
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Sign in to report or manage campus issues
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error &&
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
              <AlertCircleIcon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          }

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700">
                
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="student@zut.edu.pl" />
              
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700">
                
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors">
            
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="text-center text-sm">
            <span className="text-slate-600">Don't have an account? </span>
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500">
              
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>);

}