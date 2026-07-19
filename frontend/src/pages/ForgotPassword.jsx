import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50' : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'}`}></div>
        </div>
        <div className="w-full max-w-md z-10">
          <div className={`rounded-3xl shadow-2xl p-10 text-center ${theme === 'light' ? 'bg-white/70 backdrop-blur-xl border border-white/50' : 'bg-slate-800/70 backdrop-blur-xl border border-slate-700/50'}`}>
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500/80 to-emerald-500/80 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <FaCheckCircle size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">Check your email</h1>
            <p className={`mb-8 ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
              We sent a reset link to your inbox. Open the email and follow the link to set a new password. The link may expire soon.
            </p>
            <Link to="/login" className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
              <FaArrowLeft size={18} />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50' : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'}`}></div>
      </div>
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Forgot password?</h1>
          <p className={`${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>Enter your email and we'll send a reset link.</p>
        </div>
        <div className={`rounded-3xl shadow-2xl p-10 ${theme === 'light' ? 'bg-white/70 backdrop-blur-xl border border-white/50' : 'bg-slate-800/70 backdrop-blur-xl border border-slate-700/50'}`}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Email</label>
              <div className="relative">
                <FaEnvelope className={`absolute left-5 top-1/2 -translate-y-1/2 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className={`w-full pl-14 pr-5 py-4 rounded-xl outline-none transition-all duration-300 ${theme === 'light' ? 'bg-white/80 border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-slate-800' : 'bg-slate-900/50 border border-slate-600 focus:ring-4 focus:ring-blue-900 focus:border-blue-500 text-white placeholder-slate-500'}`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-700/80 hover:to-purple-700/80 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <div className="mt-8 text-center">
            <Link to="/login" className={`flex items-center justify-center gap-2 font-semibold hover:underline ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}`}>
              <FaArrowLeft size={16} />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
