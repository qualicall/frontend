import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'X-API-KEY': API_KEY,
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['X-API-TOKEN'] = token;
  }
  return config;
});

export interface LoginResponse {
  access_token: string;
  user_uid: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  company: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone_number?: string;
  job_title?: string;
}

export interface Question {
  uid: string;
  title: string;
  question: string;
  user_uid: string;
}

export interface Stats {
  questions: number;
  calls: number;
  answers: number;
}

export interface PasswordResetResponse {
  message: string;
  resetToken?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/token', { username: email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Invalid email or password');
    }
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<void> => {
  try {
    await api.post('/users', data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw error;
  }
};

export const getStats = async (): Promise<Stats> => {
  try {
    const response = await api.get('/api/stats_db');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stats');
    }
    throw error;
  }
};

export const getQuestions = async (): Promise<Question[]> => {
  try {
    const response = await api.get('/questions');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch questions');
    }
    throw error;
  }
};

export const createQuestion = async (data: Omit<Question, 'uid'>): Promise<Question> => {
  try {
    const response = await api.post('/questions', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create question');
    }
    throw error;
  }
};

export const updateQuestion = async (question: Question): Promise<Question> => {
  try {
    const response = await api.put(`/questions/${question.uid}`, question);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update question');
    }
    throw error;
  }
};

export const deleteQuestion = async (uid: string): Promise<void> => {
  try {
    await api.delete(`/questions/${uid}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete question');
    }
    throw error;
  }
};

export const requestPasswordReset = async (email: string): Promise<PasswordResetResponse> => {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to send reset password email');
  }

  const data: PasswordResetResponse = await response.json();
  return data;
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    await api.post('/auth/reset-password/confirm', { token, newPassword });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
    throw error;
  }
};