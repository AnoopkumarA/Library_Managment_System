import React, { useState } from 'react';
import { Book } from '../types';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BooksContext';

export default function AddBook() {
  const navigate = useNavigate();
  const { addBook } = useBooks();
  const [book, setBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    isbn: '',
    category: '',
    coverUrl: '',
  });
  
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addBook(book as Omit<Book, 'id' | 'available'>);

    setSuccessMessage('Book added successfully!');
    setTimeout(() => {
      setSuccessMessage('');
      navigate('/books');
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Book</h1>
      
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            value={book.title}
            onChange={(e) => setBook({ ...book, title: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            required
            value={book.author}
            onChange={(e) => setBook({ ...book, author: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">ISBN</label>
          <input
            type="text"
            required
            value={book.isbn}
            onChange={(e) => setBook({ ...book, isbn: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            required
            value={book.category}
            onChange={(e) => setBook({ ...book, category: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            <option value="">Select a category</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Science">Science</option>
            <option value="Technology">Technology</option>
            <option value="History">History</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
          <input
            type="url"
            required
            value={book.coverUrl}
            onChange={(e) => setBook({ ...book, coverUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Book
        </button>
      </form>
    </div>
  );
}