import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  WrenchIcon,
  FileTextIcon,
  PlusCircleIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  LayoutDashboardIcon } from
'lucide-react';
export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const navItems =
  user?.role === 'admin' ?
  [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboardIcon
  }] :

  [
  {
    name: 'My Reports',
    path: '/my-reports',
    icon: FileTextIcon
  },
  {
    name: 'Submit Report',
    path: '/submit',
    icon: PlusCircleIcon
  }];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                to={user?.role === 'admin' ? '/dashboard' : '/my-reports'}
                className="flex items-center gap-2">
                
                <WrenchIcon className="h-6 w-6 text-blue-200" />
                <span className="font-bold text-xl tracking-tight">
                  ZUT Maintenance
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-600 hover:text-white'}`}>
                    
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>);

              })}
              <div className="ml-4 flex items-center gap-4 border-l border-blue-500 pl-4">
                <div className="text-sm">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-blue-200 text-xs capitalize">
                    {user?.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-blue-200 hover:text-white hover:bg-blue-600 rounded-full transition-colors"
                  title="Logout">
                  
                  <LogOutIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600 focus:outline-none">
                
                {isMobileMenuOpen ?
                <XIcon className="h-6 w-6" /> :

                <MenuIcon className="h-6 w-6" />
                }
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen &&
        <div className="md:hidden bg-blue-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${isActive ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white'}`}>
                  
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>);

            })}
              <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-blue-100 hover:bg-blue-700 hover:text-white">
              
                <LogOutIcon className="h-5 w-5" />
                Logout
              </button>
            </div>
            <div className="pt-4 pb-3 border-t border-blue-700">
              <div className="px-5">
                <div className="text-base font-medium text-white">
                  {user?.name}
                </div>
                <div className="text-sm font-medium text-blue-300 capitalize">
                  {user?.role}
                </div>
              </div>
            </div>
          </div>
        }
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>);

}