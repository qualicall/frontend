import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../lib/api';
import { FormSection } from './FormSection';
import { InputField } from './InputField';

interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirm: string;
  company: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone_number: string;
  job_title: string;
}

export function RegisterForm() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
    company: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    phone_number: '',
    job_title: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join QualiCall and start managing your calls
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm flex items-center justify-center">
            Registration successful! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <FormSection title="Required Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              <InputField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <InputField
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
              <InputField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <InputField
                label="Confirm Password"
                name="password_confirm"
                type="password"
                value={formData.password_confirm}
                onChange={handleChange}
                required
              />
            </div>
          </FormSection>

          <FormSection title="Additional Information">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              <InputField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              <InputField
                label="Postal Code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
              />
              <InputField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
              <InputField
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              <InputField
                label="Job Title"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
              />
            </div>
          </FormSection>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Register
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}