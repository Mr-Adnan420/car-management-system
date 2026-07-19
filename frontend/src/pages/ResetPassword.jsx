import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import { useForm } from 'react-hook-form';
import { FaLock, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

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
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50' : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'}`}></div>
        </div>
        <div className="w-full max-w-md z-10">
          <div className={`rounded-3xl shadow-2xl p-10 text-center ${theme === 'light' ? 'bg-white/70 backdrop-blur-xl border border-white/50' : 'bg-slate-800/70 backdrop-blur-xl border border-slate-700/50'}`}>
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500/80 to-emerald-500/80 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <FaCheckCircle size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">Password updated!</h1>
            <p className={`mb-8 ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Link to="/login" className="w-full inline-flex items-center justify-center bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-700/80 hover:to-emerald-700/80 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40">
              Login Now
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Reset password</h1>
          <p className={`${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>Choose a new password for your account.</p>
        </div>
        <div className={`rounded-3xl shadow-2xl p-10 ${theme === 'light' ? 'bg-white/70 backdrop-blur-xl border border-white/50' : 'bg-slate-800/70 backdrop-blur-xl border border-slate-700/50'}`}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>New Password</label>
              <div className="relative">
                <FaLock className={`absolute left-5 top-1/2 -translate-y-1/2 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className={`w-full pl-14 pr-12 py-4 rounded-xl outline-none transition-all duration-300 ${theme === 'light' ? 'bg-white/80 border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-slate-800' : 'bg-slate-900/50 border border-slate-600 focus:ring-4 focus:ring-blue-900 focus:border-blue-500 text-white placeholder-slate-500'}`}
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${theme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>Confirm Password</label>
              <div className="relative">
                <FaLock className={`absolute left-5 top-1/2 -translate-y-1/2 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Confirm password is required',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  className={`w-full pl-14 pr-12 py-4 rounded-xl outline-none transition-all duration-300 ${theme === 'light' ? 'bg-white/80 border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-slate-800' : 'bg-slate-900/50 border border-slate-600 focus:ring-4 focus:ring-blue-900 focus:border-blue-500 text-white placeholder-slate-500'}`}
                  placeholder="Repeat password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${theme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-700/80 hover:to-purple-700/80 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
