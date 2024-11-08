import React from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import { useTransactions } from '../context/TransactionsContext';
import { useBooks } from '../context/BooksContext';
import { useAuth } from '../context/AuthContext';

export default function Transactions() {
  const { user } = useAuth();
  const { transactions, addTransaction } = useTransactions();
  const { books, updateBook } = useBooks();

  // Filter transactions based on user role
  const userTransactions = user?.role === 'admin' 
    ? transactions 
    : transactions.filter(t => t.userId === user?.id);

  const calculateFine = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 0.5 : 0; // $0.50 per day
  };

  const handleReturn = (bookId: string, dueDate: string) => {
    const fine = calculateFine(dueDate);
    
    // Add return transaction
    addTransaction({
      bookId,
      userId: user?.id || '',
      type: 'return',
      date: new Date().toISOString().split('T')[0],
      fine: fine > 0 ? fine : undefined,
    });

    // Update book availability
    const book = books.find(b => b.id === bookId);
    if (book) {
      updateBook({ ...book, available: true });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Transactions History</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Book
              </th>
              {user?.role === 'admin' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userTransactions.map((transaction) => {
              const book = books.find(b => b.id === transaction.bookId);
              const isOverdue = transaction.dueDate && new Date(transaction.dueDate) < new Date();
              const currentFine = transaction.dueDate ? calculateFine(transaction.dueDate) : 0;

              return (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {book?.title}
                  </td>
                  {user?.role === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.userId}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.type === 'issue'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {transaction.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.dueDate || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(transaction.fine || currentFine > 0) && (
                      <div className="flex items-center text-red-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {transaction.fine || currentFine.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.type === 'issue' && !transaction.fine && (
                      <button
                        onClick={() => handleReturn(transaction.bookId, transaction.dueDate || '')}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Return Book
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}