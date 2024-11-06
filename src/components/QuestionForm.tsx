import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuestion } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

export function QuestionForm() {
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const userUid = useAuthStore((state) => state.userUid);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries(['questions']);
      setTitle('');
      setQuestion('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && question && userUid) {
      mutation.mutate({ title, question, user_uid: userUid });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mutation.isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {mutation.error instanceof Error ? mutation.error.message : 'An error occurred'}
          </div>
        )}
        
        {mutation.isSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
            Question created successfully!
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Something short and expressive"
            required
          />
        </div>

        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">
            Question
          </label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Write a yes/no question"
            required
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? 'Creating...' : 'Create Question'}
        </button>
      </form>
    </div>
  );
}