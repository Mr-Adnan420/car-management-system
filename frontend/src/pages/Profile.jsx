import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import { PageHeader, Panel, FieldError, IconField } from '../components/ui';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Account Settings"
        subtitle="Update your profile details and password."
      />

      <Panel className="animate-fade-up">
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-8 pb-6 border-b border-dashed border-[var(--border)]">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 flex items-center justify-center font-display font-extrabold text-3xl text-white uppercase shadow-md">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="font-display text-lg font-bold">{user?.name}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{user?.email}</p>
            <span className="badge badge-accent mt-2">Partner Account</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Full Name</label>
              <IconField icon={FaUser}>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="field"
                  placeholder="Enter name"
                />
              </IconField>
              <FieldError message={errors.name?.message} />
            </div>

            <div>
              <label className="field-label">Email Address</label>
              <IconField icon={FaEnvelope}>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="field"
                  placeholder="Enter email"
                />
              </IconField>
              <FieldError message={errors.email?.message} />
            </div>

            <div>
              <label className="field-label">Phone Number</label>
              <IconField icon={FaPhone}>
                <input {...register('phone')} className="field" placeholder="Enter phone number" />
              </IconField>
            </div>

            <div>
              <label className="field-label">New Password</label>
              <IconField icon={FaLock}>
                <input
                  type="password"
                  {...register('password')}
                  className="field"
                  placeholder="Leave blank to keep same"
                />
              </IconField>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex justify-end">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </Panel>
    </div>
  );
};

export default Profile;
