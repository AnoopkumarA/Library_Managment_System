import React from 'react';
import { Settings, Users, BookOpen, AlertTriangle } from 'lucide-react';
import { useBooks } from '../context/BooksContext';
import { useRequests } from '../context/RequestsContext';

export default function Maintenance() {
  const { books } = useBooks();
  const { requests } = useRequests();

  // Calculate statistics
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.available).length;
  const borrowedBooks = totalBooks - availableBooks;
  const pendingRequests = requests.filter(req => req.status === 'pending').length;

  const stats = [
    { label: 'Total Books', value: totalBooks.toString(), icon: BookOpen },
    { label: 'Available Books', value: availableBooks.toString(), icon: Users },
    { label: 'Borrowed Books', value: borrowedBooks.toString(), icon: AlertTriangle },
    { label: 'Pending Requests', value: pendingRequests.toString(), icon: AlertTriangle },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Maintenance</h1>
        <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          <Settings className="h-5 w-5" />
          <span>System Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database Status</span>
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Backup</span>
              <span className="text-sm text-gray-900">2024-03-10 04:30 AM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">System Load</span>
              <span className="text-sm text-gray-900">23%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent System Logs</h2>
          <div className="space-y-3">
            {[
              'Database backup completed successfully',
              'New user registration: john.doe@example.com',
              'System update installed: v2.1.0',
              'Automated cleanup task completed',
            ].map((log, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}