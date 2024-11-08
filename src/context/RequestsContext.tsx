import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookRequest } from '../types';

interface RequestsContextType {
  requests: BookRequest[];
  addRequest: (request: Omit<BookRequest, 'id'>) => void;
  updateRequest: (requestId: string, status: 'approved' | 'rejected') => void;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export function RequestsProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<BookRequest[]>(() => {
    const savedRequests = localStorage.getItem('library-requests');
    return savedRequests ? JSON.parse(savedRequests) : [];
  });

  useEffect(() => {
    localStorage.setItem('library-requests', JSON.stringify(requests));
  }, [requests]);

  const addRequest = (requestData: Omit<BookRequest, 'id'>) => {
    const newRequest: BookRequest = {
      id: Date.now().toString(),
      ...requestData,
    };
    setRequests(prevRequests => [...prevRequests, newRequest]);
  };

  const updateRequest = (requestId: string, status: 'approved' | 'rejected') => {
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId ? { ...request, status } : request
      )
    );
  };

  return (
    <RequestsContext.Provider value={{ requests, addRequest, updateRequest }}>
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestsContext);
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestsProvider');
  }
  return context;
} 