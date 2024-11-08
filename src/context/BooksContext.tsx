import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types';

const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    category: 'Fiction',
    available: true,
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0446310789',
    category: 'Fiction',
    available: true,
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '3',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '978-0547928227',
    category: 'Fiction',
    available: true,
    coverUrl: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?auto=format&fit=crop&q=80&w=800',
  },
  
  {
    id: '5',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Technology',
    available: true,
    coverUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800',
  }
];

interface BooksContextType {
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'available'>) => void;
  updateBook: (book: Book) => void;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export function BooksProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>(() => {
    const savedBooks = localStorage.getItem('library-books');
    return savedBooks ? JSON.parse(savedBooks) : INITIAL_BOOKS;
  });

  useEffect(() => {
    localStorage.setItem('library-books', JSON.stringify(books));
  }, [books]);

  const addBook = (bookData: Omit<Book, 'id' | 'available'>) => {
    const newBook: Book = {
      id: Date.now().toString(),
      ...bookData,
      available: true,
    };
    setBooks(prevBooks => [...prevBooks, newBook]);
  };

  const updateBook = (updatedBook: Book) => {
    setBooks(prevBooks => 
      prevBooks.map(book => book.id === updatedBook.id ? updatedBook : book)
    );
  };

  return (
    <BooksContext.Provider value={{ books, addBook, updateBook }}>
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
} 