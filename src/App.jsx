import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './hooks/AuthProvider.jsx';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Finance from './pages/Finance';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Error Boundary para capturar erros
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erro na aplicação</h1>
            <p className="text-gray-700 mb-4">Ocorreu um erro. Por favor, recarregue a página.</p>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            user ? (
              <>
                {/* Header fixo no topo */}
                <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                
                {/* Sidebar fixa à esquerda (abaixo do header) */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                
                {/* Conteúdo principal - ajustado para não ficar sob o header e ao lado da sidebar */}
                <main className="pt-20 md:pl-64 min-h-screen bg-gray-50 transition-all duration-300">
                  <div className="max-w-7xl mx-auto p-6">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/members" element={<Members />} />
                      <Route path="/finance" element={<Finance />} />
                    </Routes>
                  </div>
                </main>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
      <ToastContainer position="bottom-right" />
    </Router>
  );
}