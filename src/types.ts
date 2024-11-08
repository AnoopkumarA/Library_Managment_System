export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  available: boolean;
  coverUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  studentId?: string;
}

export interface Transaction {
  id: string;
  bookId: string;
  userId: string;
  type: 'issue' | 'return';
  date: string;
  dueDate?: string;
  fine?: number;
}

export interface BookRequest {
  id: string;
  bookId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}