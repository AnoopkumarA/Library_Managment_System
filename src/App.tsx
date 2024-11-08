import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BooksProvider } from './context/BooksContext';
import { RequestsProvider } from './context/RequestsContext';
import { TransactionsProvider } from './context/TransactionsContext';
import Navbar from './components/Navbar';
import Books from './pages/Books';
import Transactions from './pages/Transactions';
import Maintenance from './pages/Maintenance';
import AddBook from './pages/AddBook';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BooksProvider>
          <RequestsProvider>
            <TransactionsProvider>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/books" element={
                      <ProtectedRoute>
                        <Books />
                      </ProtectedRoute>
                    } />
                    <Route path="/transactions" element={
                      <ProtectedRoute>
                        <Transactions />
                      </ProtectedRoute>
                    } />
                    <Route path="/maintenance" element={
                      <ProtectedRoute adminOnly>
                        <Maintenance />
                      </ProtectedRoute>
                    } />
                    <Route path="/add-book" element={
                      <ProtectedRoute adminOnly>
                        <AddBook />
                      </ProtectedRoute>
                    } />
                    <Route path="/" element={<Navigate to="/books" />} />
                  </Routes>
                </main>
              </div>
            </TransactionsProvider>
          </RequestsProvider>
        </BooksProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;