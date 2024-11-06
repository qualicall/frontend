import axios from 'axios';

const API_URL = '/api';
const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  }
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

export interface ResetPasswordData {
  token: string;
  new_password: string;
}

export interface Call {
  uid: string;
  filename: string;
  transcription: string;
  user_uid: string;
}

export interface AnalysisResult {
  results: any;
}

export interface Answer {
  uid: string;
  call_uid: string;
  question_uid: string;
  answer: boolean;
  created_at: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    formData.append('grant_type', 'password');
    
    console.log('=== Login Request ===');
    console.log('URL:', `${API_URL}/token`);
    console.log('Headers:', {
      'x-api-key': API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    console.log('Form Data:', Object.fromEntries(formData));
    
    const response = await api.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    console.log('=== Login Response ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    return response.data;
  } catch (error) {
    console.log('=== Login Error ===');
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Headers:', error.response?.headers);
      console.error('Error Data:', error.response?.data);
      
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.detail || [];
        console.error('Validation Errors:', validationErrors);
        throw new Error('Invalid email or password format');
      }
      throw new Error(error.response?.data?.detail || 'Invalid email or password');
    }
    console.error('Non-Axios Error:', error);
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
  try {
    const response = await api.post('/auth/reset-password', { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to send reset password email');
    }
    throw error;
  }
};

export const resetPassword = async (data: ResetPasswordData): Promise<void> => {
  try {
    await api.post('/reset-password', data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
    throw error;
  }
};

export const getCalls = async (): Promise<Call[]> => {
  try {
    const response = await api.get('/calls');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch calls');
    }
    throw error;
  }
};

export const createCall = async (file: File, userUid: string): Promise<Call> => {
  try {
    const formData = new FormData();
    formData.append('call_file', file);
    formData.append('user_uid', userUid);

    const response = await api.post('/calls', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create call');
    }
    throw error;
  }
};

export const updateCall = async (call: Call): Promise<Call> => {
  try {
    const response = await api.put(`/calls/${call.uid}`, call);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update call');
    }
    throw error;
  }
};

export const deleteCall = async (uid: string): Promise<void> => {
  try {
    await api.delete(`/calls/${uid}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete call');
    }
    throw error;
  }
};

export const analyzeCall = async (uid: string): Promise<AnalysisResult> => {
  try {
    const response = await api.post(`/calls/${uid}/analyze`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to analyze call');
    }
    throw error;
  }
};

export const getAnswers = async (): Promise<Answer[]> => {
  try {
    const response = await api.get('/answers');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch answers');
    }
    throw error;
  }
};

export const updateAnswer = async (uid: string, answer: boolean): Promise<Answer> => {
  try {
    const response = await api.put(`/answers/${uid}`, { answer });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update answer');
    }
    throw error;
  }
};