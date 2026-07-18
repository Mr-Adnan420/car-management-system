import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authAPI.forgotPassword(data);
      setEmailSent(true);
      toast.success('Password reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Check Your Email</h1>
          <p className="text-slate-600 mb-6">A password reset link has been sent to your email address.</p>
          <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-800">Forgot Password</h1>
        <p className="text-slate-600 text-center mb-6">Enter your email address and we'll send you a password reset link.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <div className="mt-6 text-center text-slate-600">
          <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
