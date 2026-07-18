import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { carAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaEye, FaFileExcel } from 'react-icons/fa';

const SoldCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const res = await carAPI.getSoldCars();
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

  const calculateProfit = (car) => {
    const partnerInvTotal = car.partnerInvestments?.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0) || 0;
    const fuelTotal = car.fuelEntries?.reduce((sum, fuel) => sum + (Number(fuel.amount) || 0), 0) || 0;
    const expenseTotal = car.expenseEntries?.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0) || 0;
    const totalInvestment = partnerInvTotal + fuelTotal + expenseTotal + (Number(car.purchasePrice) || 0);
    const profit = (car.saleDetails?.salePrice || 0) - totalInvestment;
    return profit;
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Sold Cars</h1>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Purchase Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sale Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Profit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sale Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {cars.map((car) => {
                  const profit = calculateProfit(car);
                  return (
                    <tr key={car._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">{car.carName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{Number(car.purchasePrice).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{Number(car.saleDetails?.salePrice).toLocaleString()}</td>
                      <td className={`px-6 py-4 whitespace-nowrap font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{profit.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(car.saleDetails?.saleDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Link to={`/car/${car._id}`} className="text-blue-600 hover:text-blue-800">
                            <FaEye />
                          </Link>
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
              <div className="p-8 text-center text-slate-500">No sold cars found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoldCars;
