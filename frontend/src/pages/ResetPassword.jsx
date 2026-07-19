import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import { AuthLayout, FieldError, IconField, BackLink } from '../components/ui';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
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
      <AuthLayout title="Password updated" subtitle="You can sign in with your new password.">
        <div className="text-center py-2">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center">
            <FaCheckCircle size={26} />
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Your password has been reset successfully.
          </p>
          <Link to="/login" className="btn btn-primary w-full py-3">
            Login Now
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Choose a new password for your account."
      footer={<BackLink />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="field-label">New Password</label>
          <IconField icon={FaLock}>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              className="field"
              placeholder="Min. 6 characters"
            />
          </IconField>
          <FieldError message={errors.password?.message} />
        </div>
        <div>
          <label className="field-label">Confirm Password</label>
          <IconField icon={FaLock}>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              className="field"
              placeholder="Repeat password"
            />
          </IconField>
          <FieldError message={errors.confirmPassword?.message} />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
