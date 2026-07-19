import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { carAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/ui';
import {
  FaCar,
  FaClipboardList,
  FaCheckDouble,
  FaMoneyBillWave,
  FaCoins,
  FaChartLine,
  FaPlus,
  FaArrowRight,
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await carAPI.getDashboardStats();
        setStats(res.data);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = stats
    ? [
        {
          label: 'Total Cars',
          value: stats.totalCars,
          icon: FaCar,
          tone: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
        },
        {
          label: 'Draft Cars',
          value: stats.draftCars,
          icon: FaClipboardList,
          tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        },
        {
          label: 'Sold Cars',
          value: stats.soldCars,
          icon: FaCheckDouble,
          tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        },
        {
          label: 'Total Investment',
          value: `Rs ${Number(stats.totalInvestment).toLocaleString()}`,
          icon: FaMoneyBillWave,
          tone: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
        },
        {
          label: 'Total Expenses',
          value: `Rs ${Number(stats.totalExpenses).toLocaleString()}`,
          icon: FaCoins,
          tone: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        },
        {
          label: 'Total Profit',
          value: `Rs ${Number(stats.totalProfit).toLocaleString()}`,
          icon: FaChartLine,
          tone:
            stats.totalProfit >= 0
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        },
      ]
    : [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      <div className="panel p-6 sm:p-8 relative overflow-hidden animate-fade-up">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />
        <div className="absolute right-20 bottom-0 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] mb-2">
              {greeting}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text)]">
              {user?.name || 'Partner'}
            </h1>
            <p className="mt-2 text-sm text-[var(--text-muted)] max-w-lg">
              Here&apos;s your inventory and financial snapshot for today.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/add-car" className="btn btn-primary">
              <FaPlus size={12} />
              Add Car
            </Link>
            <Link to="/draft-cars" className="btn btn-secondary">
              Draft inventory
              <FaArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading analytics..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`panel p-5 sm:p-6 group hover:-translate-y-0.5 transition-transform duration-200 animate-fade-up animate-fade-up-delay-${Math.min(i % 3, 2) || 1}`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    {card.label}
                  </span>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.tone}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <p className="font-display text-2xl sm:text-[1.7rem] font-bold tracking-tight text-[var(--text)]">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up">
          {[
            { to: '/draft-cars', title: 'Draft Cars', desc: 'Track costs before sale', icon: FaClipboardList },
            { to: '/sold-cars', title: 'Sold Cars', desc: 'Review realized profit', icon: FaCheckDouble },
            { to: '/profile', title: 'Profile', desc: 'Account & security', icon: FaCar },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="panel p-5 flex items-center gap-4 hover:border-[var(--accent)]/30 transition-colors group"
              >
                <div className="w-11 h-11 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold text-[var(--text)]">{item.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                </div>
                <FaArrowRight
                  size={12}
                  className="text-[var(--text-soft)] group-hover:text-[var(--accent)] transition-colors"
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
