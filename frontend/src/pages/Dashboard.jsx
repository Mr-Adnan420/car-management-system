import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { carAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaCar, FaClipboard, FaCheckCircle, FaMoneyBillWave, FaCoins, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await carAPI.getDashboardStats();
        setStats(res.data);
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        { label: 'Total Cars', value: stats.totalCars, icon: FaCar, color: 'bg-blue-500' },
        { label: 'Draft Cars', value: stats.draftCars, icon: FaClipboard, color: 'bg-yellow-500' },
        { label: 'Sold Cars', value: stats.soldCars, icon: FaCheckCircle, color: 'bg-green-500' },
        { label: 'Total Investment', value: `₹${stats.totalInvestment.toLocaleString()}`, icon: FaMoneyBillWave, color: 'bg-purple-500' },
        { label: 'Total Expenses', value: `₹${stats.totalExpenses.toLocaleString()}`, icon: FaCoins, color: 'bg-red-500' },
        { label: 'Total Profit', value: `₹${stats.totalProfit.toLocaleString()}`, icon: FaChartLine, color: 'bg-emerald-500' },
      ]
    : [];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard</h1>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-4">
                  <div className={`${card.color} text-white p-4 rounded-lg`}>
                    <card.icon size={24} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">{card.label}</p>
                    <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
