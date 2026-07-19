import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome,
  FaPlus,
  FaCar,
  FaCheckCircle,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FaHome, label: 'Dashboard', color: 'text-blue-500' },
    { path: '/add-car', icon: FaPlus, label: 'Add Car', color: 'text-green-500' },
    { path: '/draft-cars', icon: FaCar, label: 'Draft Cars', color: 'text-yellow-500' },
    { path: '/sold-cars', icon: FaCheckCircle, label: 'Sold Cars', color: 'text-emerald-500' },
    { path: '/profile', icon: FaUser, label: 'Profile', color: 'text-purple-500' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white h-screen fixed left-0 top-0 shadow-2xl flex flex-col z-50">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <FaCar size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Car Management
            </h1>
            <p className="text-xs text-slate-400">Manage your inventory</p>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-900/30'
                  : 'hover:bg-slate-700/50'
              }`}
            >
              <Icon className={isActive ? 'text-white' : item.color} size={18} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-4 p-3 bg-slate-700/30 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 font-medium shadow-lg shadow-red-900/30"
        >
          <FaSignOutAlt size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
