import { Link } from 'react-router-dom';

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--text-muted)] max-w-xl">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className = '' }) {
  return <div className={`panel p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function SectionTitle({ children, icon: Icon, className = '' }) {
  return (
    <h2 className={`font-display text-base font-bold text-[var(--text)] flex items-center gap-2 m-0 ${className}`}>
      {Icon && (
        <span className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0">
          <Icon size={14} />
        </span>
      )}
      {children}
    </h2>
  );
}

export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 animate-fade-up">
      <div className="spinner" />
      <p className="text-sm font-medium text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="panel flex flex-col items-center justify-center min-h-[42vh] text-center p-8 animate-fade-up">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center mb-5">
          <Icon size={28} />
        </div>
      )}
      <h3 className="font-display text-xl font-bold text-[var(--text)] mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--text-muted)] max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-teal-400/20 border border-teal-300/30 flex items-center justify-center backdrop-blur-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 17h14v-2.5l-1.5-4.5h-11L5 14.5V17z" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="7.5" cy="17" r="1.5" fill="currentColor" />
                <circle cx="16.5" cy="17" r="1.5" fill="currentColor" />
                <path d="M7 10.5l1.2-3.5h7.6L17 10.5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">CarMaster</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight max-w-md">
            Inventory & profit, in one clear view.
          </h2>
          <p className="mt-3 text-slate-300/90 max-w-sm text-sm leading-relaxed">
            Track purchases, partner investments, expenses, and sales — built for car dealers who move fast.
          </p>
        </div>
        <div className="hidden md:flex gap-6 text-sm text-slate-300/80">
          <div>
            <p className="font-display text-2xl font-bold text-white">Live</p>
            <p>Cost tracking</p>
          </div>
          <div className="w-px bg-white/15" />
          <div>
            <p className="font-display text-2xl font-bold text-white">Partner</p>
            <p>Profit splits</p>
          </div>
          <div className="w-px bg-white/15" />
          <div>
            <p className="font-display text-2xl font-bold text-white">Excel</p>
            <p>One-click export</p>
          </div>
        </div>
      </aside>

      <main className="app-bg relative flex items-center justify-center p-6 sm:p-10">
        <div className="absolute inset-0 app-grid pointer-events-none" />
        <div className="relative w-full max-w-md animate-fade-up">
          <div className="mb-7">
            <h1 className="font-display text-3xl font-bold text-[var(--text)]">{title}</h1>
            {subtitle && <p className="mt-1.5 text-[var(--text-muted)] text-sm">{subtitle}</p>}
          </div>
          <div className="panel p-6 sm:p-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-[var(--text-muted)]">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

export function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-[var(--danger)] text-xs mt-1.5">{message}</p>;
}

export function IconField({ icon: Icon, children }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-0 z-[1] flex w-10 items-center justify-center text-[var(--text-soft)]">
        <Icon size={14} aria-hidden className="block shrink-0" />
      </span>
      <div className="w-full [&_input]:pl-10">{children}</div>
    </div>
  );
}

export function BackLink({ to = '/login', label = 'Back to Login' }) {
  return (
    <Link to={to} className="text-[var(--accent)] font-semibold hover:underline">
      {label}
    </Link>
  );
}
