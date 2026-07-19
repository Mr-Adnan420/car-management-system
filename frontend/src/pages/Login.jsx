import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { AuthLayout, FieldError, IconField } from '../components/ui';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your inventory and profits."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-[var(--accent)] font-semibold hover:underline">
            Create one
          </Link>
        </>
      }
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
              autoComplete="email"
            />
          </IconField>
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="field-label mb-0">Password</label>
            <Link to="/forgot-password" className="text-xs font-semibold text-[var(--accent)] hover:underline">
              Forgot password?
            </Link>
          </div>
          <IconField icon={FaLock}>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="field"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </IconField>
          <FieldError message={errors.password?.message} />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 mt-2">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
