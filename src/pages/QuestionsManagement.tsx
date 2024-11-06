import React from 'react';
import { QuestionEditor } from '../components/QuestionEditor';
import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';

export function QuestionsManagement() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Questions Management</h1>
        <QuestionEditor />
      </div>
    </div>
  );
}