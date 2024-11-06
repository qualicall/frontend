import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStats } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { data: stats } = useQuery(['stats'], getStats);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">QualiCall Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <p className="text-lg text-gray-600 mb-8">
          Welcome to the QualiCall Dashboard! This application allows you to manage and analyze call center recordings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Questions</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.questions || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Calls</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.calls || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Answers</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.answers || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}