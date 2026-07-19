import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { AuthLayout, FieldError, IconField } from '../components/ui';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
      await registerUser(data.name, data.email, data.password);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start tracking cars, partners, and profits today."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--accent)] font-semibold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="field-label">Full Name</label>
          <IconField icon={FaUser}>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="field"
              placeholder="Your name"
              autoComplete="name"
            />
          </IconField>
          <FieldError message={errors.name?.message} />
        </div>

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
          <label className="field-label">Password</label>
          <IconField icon={FaLock}>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              className="field"
              placeholder="Min. 6 characters"
              autoComplete="new-password"
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
              autoComplete="new-password"
            />
          </IconField>
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 mt-2">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;
