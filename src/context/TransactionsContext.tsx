import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction } from '../types';

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    bookId: '1',
    userId: '2',
    type: 'issue',
    date: '2024-03-10',
    dueDate: '2024-03-24',
  },
  {
    id: '2',
    bookId: '2',
    userId: '2',
    type: 'return',
    date: '2024-03-08',
    fine: 5,
  },
];

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('library-transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    localStorage.setItem('library-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...transactionData,
    };
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
} 