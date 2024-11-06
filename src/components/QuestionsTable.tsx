import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Question, updateQuestion, deleteQuestion } from '../lib/api';
import { TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface QuestionsTableProps {
  questions: Question[];
}

export function QuestionsTable({ questions }: QuestionsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Question | null>(null);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries(['questions']);
      setEditingId(null);
      setEditData(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries(['questions']);
    },
  });

  const handleEdit = (question: Question) => {
    setEditingId(question.uid);
    setEditData(question);
  };

  const handleSave = () => {
    if (editData) {
      updateMutation.mutate(editData);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleDelete = (uid: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      deleteMutation.mutate(uid);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Question
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {questions.map((question) => (
            <tr key={question.uid}>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === question.uid ? (
                  <input
                    type="text"
                    value={editData?.title || ''}
                    onChange={(e) => setEditData(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <div className="text-sm text-gray-900">{question.title}</div>
                )}
              </td>
              <td className="px-6 py-4">
                {editingId === question.uid ? (
                  <input
                    type="text"
                    value={editData?.question || ''}
                    onChange={(e) => setEditData(prev => prev ? { ...prev, question: e.target.value } : null)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <div className="text-sm text-gray-900">{question.question}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editingId === question.uid ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="text-green-600 hover:text-green-900"
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(question)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(question.uid)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}