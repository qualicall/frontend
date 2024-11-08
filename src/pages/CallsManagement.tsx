import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCalls, createCall, deleteCall, analyzeCall } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import type { Call } from '../lib/api';

export function CallsManagement() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCallId, setSelectedCallId] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const queryClient = useQueryClient();
  const userUid = useAuthStore((state) => state.userUid);

  const { data: callsData, isLoading } = useQuery(
    ['calls', page, pageSize],
    () => getCalls(page, pageSize)
  );

  const createMutation = useMutation({
    mutationFn: (file: File) => createCall(file, userUid!),
    onSuccess: () => {
      queryClient.invalidateQueries(['calls']);
      setSelectedFile(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCall,
    onSuccess: () => queryClient.invalidateQueries(['calls']),
  });

  const analyzeMutation = useMutation({
    mutationFn: analyzeCall,
    onSuccess: (data) => {
      setAnalysisResults(data);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile && userUid) {
      createMutation.mutate(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (selectedCallId) {
      analyzeMutation.mutate(selectedCallId);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Upload New Call</h2>
        <div className="space-y-4">
          <input
            type="file"
            accept=".wav,.mp3"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || createMutation.isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {createMutation.isLoading ? 'Uploading...' : 'Upload Call'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Existing Calls</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filename
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transcription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {callsData?.items.map((call) => (
                <tr key={call.uid}>
                  <td className="px-6 py-4 whitespace-nowrap">{call.filename}</td>
                  <td className="px-6 py-4">{call.transcription}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedCallId(call.uid)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Analyze
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(call.uid)}
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

        {callsData && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, callsData.total)} of {callsData.total} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= callsData.pages}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedCallId && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Analyze Call</h2>
          <button
            onClick={handleAnalyze}
            disabled={analyzeMutation.isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {analyzeMutation.isLoading ? 'Analyzing...' : 'Analyze Selected Call'}
          </button>

          {analysisResults && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Analysis Results:</h3>
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                {JSON.stringify(analysisResults, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 