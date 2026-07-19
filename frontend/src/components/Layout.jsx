import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  FaHome,
  FaPlus,
  FaCar,
  FaCheckCircle,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
} from 'react-icons/fa';

const navItems = [
  { path: '/', icon: FaHome, label: 'Dashboard' },
  { path: '/add-car', icon: FaPlus, label: 'Add Car' },
  { path: '/draft-cars', icon: FaCar, label: 'Draft Cars' },
  { path: '/sold-cars', icon: FaCheckCircle, label: 'Sold Cars' },
  { path: '/profile', icon: FaUser, label: 'Profile' },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMobile = () => setMobileMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen relative overflow-x-hidden app-bg text-[var(--text)]">
      <div className="fixed inset-0 app-grid pointer-events-none -z-10" />

      <header className="sticky top-0 z-50 w-full px-3 sm:px-5 lg:px-8 pt-3 sm:pt-4">
        <div className="max-w-7xl mx-auto glass rounded-2xl">
          <div className="px-3 sm:px-5 h-14 sm:h-16 flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group" onClick={closeMobile}>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <FaCar size={16} />
              </div>
              <div className="leading-tight">
                <span className="font-display text-lg sm:text-xl font-bold tracking-tight block">
                  CarMaster
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)] font-semibold">
                  Dealership OS
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    <Icon size={13} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                title="Toggle theme"
                className="btn btn-ghost btn-icon"
              >
                {theme === 'light' ? <FaMoon size={14} /> : <FaSun size={14} />}
              </button>

              <Link
                to="/profile"
                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-600 to-cyan-700 flex items-center justify-center font-bold text-xs text-white uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-xs font-semibold max-w-[90px] truncate">{user?.name || 'User'}</span>
              </Link>

              <button type="button" onClick={handleLogout} className="btn btn-danger text-xs py-2 px-3">
                <FaSignOutAlt size={12} />
                <span>Logout</span>
              </button>
            </div>

            <div className="flex md:hidden items-center gap-1.5">
              <button type="button" onClick={toggleTheme} className="btn btn-ghost btn-icon">
                {theme === 'light' ? <FaMoon size={14} /> : <FaSun size={14} />}
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="btn btn-ghost btn-icon"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <FaTimes size={15} /> : <FaBars size={15} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-2 max-w-7xl mx-auto animate-fade-up">
            <div className="glass rounded-2xl p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobile}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="h-px bg-[var(--border)] my-2" />

              <div className="flex items-center justify-between gap-3 px-2 py-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 flex items-center justify-center font-bold text-sm text-white uppercase shrink-0">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{user?.name}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                  </div>
                </div>
                <button type="button" onClick={handleLogout} className="btn btn-danger text-xs py-2 px-3 shrink-0">
                  <FaSignOutAlt size={12} />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-6 sm:py-8 relative z-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
