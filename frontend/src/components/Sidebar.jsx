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

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/add-car', icon: FaPlus, label: 'Add New Car' },
    { path: '/draft-cars', icon: FaCar, label: 'Draft Cars' },
    { path: '/sold-cars', icon: FaCheckCircle, label: 'Sold Cars' },
    { path: '/profile', icon: FaUser, label: 'Profile' },
  ];

  return (
    <div className="w-64 bg-slate-800 text-white h-screen fixed left-0 top-0 p-4 flex flex-col">
      <div className="text-2xl font-bold mb-8">Car Management</div>
      <div className="flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
              isActive(item.path)
                ? 'bg-blue-600'
                : 'hover:bg-slate-700'
            }`}
          >
            <item.icon />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="border-t border-slate-700 pt-4">
        <div className="mb-2 text-sm text-slate-400">{user?.name}</div>
        <button
          onClick={logout}
          className="flex items-center gap-3 p-3 rounded-lg w-full hover:bg-slate-700 transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
