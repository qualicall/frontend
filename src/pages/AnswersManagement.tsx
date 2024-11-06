import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnswers, updateAnswer } from '../lib/api';
import { format } from 'date-fns';

export function AnswersManagement() {
  const queryClient = useQueryClient();
  const { data: answers, isLoading } = useQuery(['answers'], getAnswers);

  const updateMutation = useMutation({
    mutationFn: ({ uid, answer }: { uid: string; answer: boolean }) =>
      updateAnswer(uid, answer),
    onSuccess: () => {
      queryClient.invalidateQueries(['answers']);
    },
  });

  const handleAnswerChange = (uid: string, newValue: boolean) => {
    updateMutation.mutate({ uid, answer: newValue });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Results Management</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">My Results</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Call ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Answer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {answers?.map((answer) => (
                <tr key={answer.uid}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {answer.call_uid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {answer.question_uid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={answer.answer}
                      onChange={(e) => handleAnswerChange(answer.uid, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(answer.created_at), 'PPpp')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {updateMutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Failed to update answer'}
        </div>
      )}
    </div>
  );
} 