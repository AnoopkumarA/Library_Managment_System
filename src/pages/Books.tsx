import React, { useState } from 'react';
import BookCard from '../components/BookCard';
import { Search } from 'lucide-react';
import { Book, BookRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BooksContext';
import { useRequests } from '../context/RequestsContext';

export default function Books() {
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();
  const { books, updateBook } = useBooks();
  const { requests, addRequest, updateRequest } = useRequests();

  const filteredBooks = books.filter(book =>
    (book.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (book.author?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (book.isbn || '').includes(searchTerm)
  );

  const handleBookRequest = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    
    // Check if user already has a pending request for this book
    const existingRequest = requests.find(
      r => r.bookId === bookId && 
           r.userId === user?.id && 
           r.status === 'pending'
    );

    if (existingRequest) {
      setSuccessMessage('You already have a pending request for this book.');
      return;
    }

    addRequest({
      bookId,
      userId: user?.id || '',
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
    });

    setSuccessMessage(`"${book?.title}" has been requested successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleRequestAction = (requestId: string, action: 'approved' | 'rejected') => {
    updateRequest(requestId, action);

    if (action === 'approved') {
      const request = requests.find(r => r.id === requestId);
      if (request) {
        const bookToUpdate = books.find(book => book.id === request.bookId);
        if (bookToUpdate) {
          updateBook({ ...bookToUpdate, available: false });
        }
      }
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Library Catalog</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center justify-between">
          {successMessage}
        </div>
      )}

      {user?.role === 'admin' && pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingRequests.map(request => {
                  const book = books.find(b => b.id === request.bookId);
                  return (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {book?.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{request.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{request.requestDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                        <button
                          onClick={() => handleRequestAction(request.id, 'approved')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRequestAction(request.id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onRequest={handleBookRequest}
          />
        ))}
      </div>
    </div>
  );
}