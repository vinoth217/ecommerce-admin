import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navClass = ({ isActive }) =>
    `flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium ${
      isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="flex flex-col border-b border-[var(--line)] bg-[#102027] text-white lg:border-b-0 lg:border-r">
        <div className="px-6 py-6">
          <p className="text-xs uppercase tracking-[0.28em] text-teal-200/80">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Commerce Desk</h1>
        </div>

        <nav className="space-y-1 px-3 pb-6">
          <NavLink to="/dashboard" className={navClass}>
            Products
          </NavLink>
          <NavLink to="/customers" className={navClass}>
            Customers
          </NavLink>
          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center rounded-xl px-4 py-3 text-left text-sm text-white/45"
          >
            Orders (soon)
          </button>
        </nav>

        <div className="mt-auto border-t border-white/10 px-6 py-5">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="mt-0.5 truncate text-xs text-white/60">{user?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 rounded-xl border border-white/20 px-3 py-2 text-xs font-medium hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
