import React from 'react';
import { Users, DollarSign, Calendar, Bell, X, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/members', icon: Users, label: 'Membros' },
  { to: '/finance', icon: DollarSign, label: 'Financeiro' },
  { to: '/events', icon: Calendar, label: 'Eventos' },
  { to: '/notifications', icon: Bell, label: 'Notificações' },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-20 left-0 h-[calc(100vh-5rem)] bg-gray-800 text-white shadow-lg z-40 w-64 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white hover:bg-gray-700 p-1 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-4">
          <ul>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 p-4 transition-colors ${
                      isActive 
                        ? 'bg-gray-700 border-l-4 border-orange-500 text-white' 
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                    onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}