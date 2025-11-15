import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function Header({ user, sidebarOpen, setSidebarOpen }) {
  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Cristo Vive</h1>
            <p className="text-xs opacity-90 mt-1">Gestão de Membresia</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded hidden sm:block">
            {user.email}
          </span>
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-2 bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}