import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authAPI.resetPassword(resetToken, data);
      setPasswordReset(true);
      toast.success('Password reset successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (passwordReset) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Password Reset Successful!</h1>
          <p className="text-slate-600 mb-6">Your password has been reset. You can now login with your new password.</p>
          <Link to="/login" className="text-blue-600 hover:underline">Login Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-800">Reset Password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', { required: 'Confirm password is required', validate: (value) => value === password || 'Passwords do not match' })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
