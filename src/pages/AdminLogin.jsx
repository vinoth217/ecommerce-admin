import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthScreen, { authInputClassName } from '../components/AuthScreen';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Invalid credentials. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreen
      title="Sign in"
      subtitle="Manage products, inventory, and catalog updates."
      footer={
        <div className="mt-4 w-full max-w-md rounded-2xl border border-[var(--line)] bg-white/80 px-5 py-4 text-sm shadow-sm backdrop-blur">
          <p className="font-medium text-[var(--ink)]">Demo admin credentials</p>
          <div className="mt-2 space-y-1 text-[var(--muted)]">
            <p>
              Email:{' '}
              <span className="font-mono text-[var(--ink)]">admin@ecommerce.com</span>
            </p>
            <p>
              Password:{' '}
              <span className="font-mono text-[var(--ink)]">Admin@123!</span>
            </p>
          </div>
        </div>
      }
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
          <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClassName}
            placeholder="admin@ecommerce.com"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClassName}
            placeholder="••••••••"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--accent-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Login'}
          </button>
          <Link
            to="/register"
            className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--accent)] bg-white px-4 py-3 font-semibold text-[var(--accent)] transition hover:bg-teal-50"
          >
            Register
          </Link>
        </div>
      </form>
    </AuthScreen>
  );
}
