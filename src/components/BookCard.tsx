import React from 'react';
import { Book } from '../types';
import { useAuth } from '../context/AuthContext';

interface BookCardProps {
  book: Book;
  onRequest: (bookId: string) => void;
}


export default function BookCard({ book, onRequest }: BookCardProps) {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={book.coverUrl}
        alt={book.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-gray-600">by {book.author}</p>
        <p className="text-sm text-gray-500 mt-1">ISBN: {book.isbn}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-sm ${
            book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {book.available ? 'Available' : 'Borrowed'}
          </span>
          {user?.role === 'user' && book.available && (
            <button
              onClick={() => onRequest(book.id)}
              className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
            >
              Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}