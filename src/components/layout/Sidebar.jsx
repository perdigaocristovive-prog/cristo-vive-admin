import React from 'react';
import { Users, DollarSign, Calendar, Bell, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', icon: Users, label: 'Dashboard' },
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
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white shadow-lg z-40 w-64 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:z-auto`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold">Sistema de Gestão</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-4">
          <ul>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 p-4 hover:bg-gray-700 transition ${
                      location.pathname === item.to ? 'bg-gray-700 border-l-4 border-orange-500' : ''
                    }`}
                    onClick={() => window.innerWidth < 768 && setSidebarOpen(false)} // Fecha sidebar em mobile após clique
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
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