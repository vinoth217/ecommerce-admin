export default function AuthScreen({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[0_24px_60px_rgba(20,33,43,0.08)]">
        <div className="border-b border-[var(--line)] bg-[linear-gradient(135deg,#0f766e,#134e4a)] px-8 py-8 text-white">
          <p className="text-sm uppercase tracking-[0.24em] text-teal-100">Commerce Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-teal-50/90">{subtitle}</p>
        </div>
        {children}
      </div>
      {footer}
    </div>
  );
}

export const authInputClassName =
  'w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-teal-100';
