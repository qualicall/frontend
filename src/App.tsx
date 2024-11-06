import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import { Layout } from './components/Layout';
import { RegisterForm } from './components/RegisterForm';
import { ForgotPassword } from './components/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { ResetPassword } from './pages/ResetPassword';
import { QuestionsManagement } from './pages/QuestionsManagement';
import { CallsManagement } from './pages/CallsManagement';
import { AnswersManagement } from './pages/AnswersManagement';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/questions"
            element={
              <PrivateRoute>
                <QuestionsManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/calls"
            element={
              <PrivateRoute>
                <CallsManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/answers"
            element={
              <PrivateRoute>
                <AnswersManagement />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;