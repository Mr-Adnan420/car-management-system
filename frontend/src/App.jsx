import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import AddCar from './pages/AddCar';
import DraftCars from './pages/DraftCars';
import SoldCars from './pages/SoldCars';
import ViewCar from './pages/ViewCar';
import EditCar from './pages/EditCar';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password/:resetToken" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add-car" element={<ProtectedRoute><AddCar /></ProtectedRoute>} />
          <Route path="/draft-cars" element={<ProtectedRoute><DraftCars /></ProtectedRoute>} />
          <Route path="/sold-cars" element={<ProtectedRoute><SoldCars /></ProtectedRoute>} />
          <Route path="/car/:id" element={<ProtectedRoute><ViewCar /></ProtectedRoute>} />
          <Route path="/edit-car/:id" element={<ProtectedRoute><EditCar /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default App;
