import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { carAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaEye, FaEdit, FaTrash, FaFilePdf, FaFileExcel } from 'react-icons/fa';

const DraftCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCars = async () => {
    try {
      const res = await carAPI.getDraftCars();
      setCars(res.data);
    } catch (err) {
      toast.error('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const deleteCar = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await carAPI.deleteCar(id);
        toast.success('Car deleted');
        fetchCars();
      } catch (err) {
        toast.error('Failed to delete car');
      }
    }
  };

  const exportExcel = async (id, registrationNumber) => {
    try {
      const res = await carAPI.exportExcel(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `car-${registrationNumber}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      toast.error('Failed to export');
    }
  };

  const calculateTotals = (car) => {
    const partnerInvTotal = car.partnerInvestments?.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0) || 0;
    const fuelTotal = car.fuelEntries?.reduce((sum, fuel) => sum + (Number(fuel.amount) || 0), 0) || 0;
    const expenseTotal = car.expenseEntries?.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0) || 0;
    return {
      totalInvestment: partnerInvTotal + fuelTotal + expenseTotal,
      expenses: expenseTotal,
    };
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Draft Cars</h1>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl">Loading...</div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Car Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Registration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Purchase Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Investment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Expenses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Current Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {cars.map((car) => {
                  const { totalInvestment, expenses } = calculateTotals(car);
                  const currentCost = (Number(car.purchasePrice) || 0) + totalInvestment;
                  return (
                    <tr key={car._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">{car.carName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{car.registrationNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{Number(car.purchasePrice).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{totalInvestment.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{expenses.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{currentCost.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Link to={`/car/${car._id}`} className="text-blue-600 hover:text-blue-800">
                            <FaEye />
                          </Link>
                          <Link to={`/edit-car/${car._id}`} className="text-green-600 hover:text-green-800">
                            <FaEdit />
                          </Link>
                          <button onClick={() => deleteCar(car._id)} className="text-red-600 hover:text-red-800">
                            <FaTrash />
                          </button>
                          <button onClick={() => exportExcel(car._id, car.registrationNumber)} className="text-emerald-600 hover:text-emerald-800">
                            <FaFileExcel />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {cars.length === 0 && (
              <div className="p-8 text-center text-slate-500">No draft cars found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftCars;
