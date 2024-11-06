import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQuestions } from '../lib/api';
import { QuestionForm } from '../components/QuestionForm';
import { QuestionsTable } from '../components/QuestionsTable';
import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';

export function QuestionsManagement() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: questions, isLoading, error } = useQuery(['questions'], getQuestions);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Questions Management</h1>

        <div className="space-y-8">
          <QuestionForm />

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Questions</h2>
            
            {isLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            )}

            {error instanceof Error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error.message}
              </div>
            )}

            {questions && questions.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No questions found. Create your first question above.
              </div>
            )}

            {questions && questions.length > 0 && (
              <QuestionsTable questions={questions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}