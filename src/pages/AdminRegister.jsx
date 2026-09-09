import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthScreen, { authInputClassName } from '../components/AuthScreen';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export default function AdminRegister() {
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-2xl border border-[var(--line)] bg-white px-6 py-4 text-sm text-[var(--muted)] shadow-sm">
          Loading…
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Could not create the admin account.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen
      title="Create admin"
      subtitle="Register a new admin user to manage products, inventory, and catalog updates."
    >
      <form onSubmit={handleSubmit} className="space-y-5 px-8 py-8">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[var(--danger)]"
          >
            {error}
          </div>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Full name</span>
          <input
            name="name"
            required
            minLength={2}
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            className={authInputClassName}
            placeholder="Store Admin"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className={authInputClassName}
            placeholder="admin@ecommerce.com"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
            Phone <span className="font-normal text-[var(--muted)]">(optional)</span>
          </span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            className={authInputClassName}
            placeholder="9876543210"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Password</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            className={authInputClassName}
            placeholder="Min 8 chars, upper, lower, number"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Confirm password</span>
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={authInputClassName}
            placeholder="Re-enter password"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--accent-dark)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Creating account…' : 'Create admin account'}
        </button>

        <p className="text-center text-sm text-[var(--muted)]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[var(--accent)] hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthScreen>
  );
}
