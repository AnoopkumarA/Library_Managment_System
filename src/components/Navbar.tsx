import React from 'react';
import { BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8" />
            <span className="font-bold text-xl">LibraryHub</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            
            <Link to="/books" className="hover:text-indigo-200">Books</Link>
            <Link to="/transactions" className="hover:text-indigo-200">Transactions</Link>
            {user?.role === 'admin' && (
              <>
                <Link to="/maintenance" className="hover:text-indigo-200">Maintenance</Link>
                <Link to="/add-book" className="hover:text-indigo-200">Add Book</Link>
              </>
            )}
            <button
              onClick={logout}
              className="flex items-center space-x-1 hover:text-indigo-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}