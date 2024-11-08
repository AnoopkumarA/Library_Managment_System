import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS = [
  { id: '1', email: 'admin@example.com', password: 'admin123', role: 'admin' as const },
  { id: '2', email: 'user@example.com', password: 'user123', role: 'user' as const },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('library-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    // Simulate API call
    const mockUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (!mockUser) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = mockUser;
    setUser(userWithoutPassword);
    localStorage.setItem('library-user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('library-user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}