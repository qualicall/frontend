import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from '../lib/api';
import { Question } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

interface EditableQuestion extends Question {
  isNew?: boolean;
}

export function QuestionEditor(): JSX.Element {
  const [questions, setQuestions] = useState<EditableQuestion[]>([]);
  const queryClient = useQueryClient();
  const userUid = useAuthStore((state) => state.userUid);

  const { data: fetchedQuestions, isLoading } = useQuery(['questions'], getQuestions);

  const createMutation = useMutation({
    mutationFn: (question: Omit<Question, 'uid'>) => createQuestion(question),
    onSuccess: () => queryClient.invalidateQueries(['questions']),
  });

  const updateMutation = useMutation({
    mutationFn: updateQuestion,
    onSuccess: () => queryClient.invalidateQueries(['questions']),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => queryClient.invalidateQueries(['questions']),
  });

  useEffect(() => {
    if (fetchedQuestions) {
      setQuestions(fetchedQuestions);
    }
  }, [fetchedQuestions]);

  const handleAddRow = () => {
    if (!userUid) return;
    
    setQuestions([
      ...questions,
      { 
        uid: `new-${Date.now()}`, 
        title: '', 
        question: '', 
        isNew: true,
        user_uid: userUid 
      },
    ]);
  };

  const handleChange = (index: number, field: keyof Question, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleSave = async (question: EditableQuestion) => {
    if (!userUid) return;

    try {
      if (question.isNew) {
        const { uid, isNew, ...newQuestion } = question;
        await createMutation.mutateAsync({
          ...newQuestion,
          user_uid: userUid,
        });
      } else {
        await updateMutation.mutateAsync({
          ...question,
          user_uid: userUid,
        });
      }
    } catch (error) {
      console.error('Failed to save question:', error);
    }
  };

  const handleDelete = async (uid: string) => {
    try {
      await deleteMutation.mutateAsync(uid);
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddRow}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add New Question
      </button>

      <div className="overflow-x-auto">
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
            {questions.map((question, index) => (
              <tr key={question.uid}>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={question.title}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Title"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => handleChange(index, 'question', e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Question"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleSave(question)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDelete(question.uid)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 