import { useState } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { AuthLayout, FieldError, IconField, BackLink } from '../components/ui';

const ForgotPassword = () => {
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
      <AuthLayout title="Check your email" subtitle="We sent a reset link to your inbox.">
        <div className="text-center py-2">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center">
            <FaCheckCircle size={26} />
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Open the email and follow the link to set a new password. The link may expire soon.
          </p>
          <BackLink />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we'll send a reset link."
      footer={<BackLink />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="field-label">Email</label>
          <IconField icon={FaEnvelope}>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="field"
              placeholder="you@dealership.com"
            />
          </IconField>
          <FieldError message={errors.email?.message} />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
