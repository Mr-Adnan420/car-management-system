import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { carAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useForm, useFieldArray } from 'react-hook-form';
import { FaArrowLeft, FaCheckCircle, FaFileExcel } from 'react-icons/fa';

const ViewCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSellModal, setShowSellModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await carAPI.getCarById(id);
        setCar(res.data);
      } catch (err) {
        toast.error('Failed to load car');
        navigate('/draft-cars');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, navigate]);

  const exportExcel = async () => {
    try {
      const res = await carAPI.exportExcel(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `car-${car.registrationNumber}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      toast.error('Failed to export');
    }
  };

  const sellCar = async (data) => {
    try {
      await carAPI.sellCar(id, data);
      toast.success('Car marked as sold!');
      setShowSellModal(false);
      const res = await carAPI.getCarById(id);
      setCar(res.data);
    } catch (err) {
      toast.error('Failed to sell car');
    }
  };

  const calculatePartnerProfit = () => {
    if (!car || car.status !== 'sold') return [];
    const partnerInvTotal = car.partnerInvestments?.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0) || 0;
    const fuelTotal = car.fuelEntries?.reduce((sum, fuel) => sum + (Number(fuel.amount) || 0), 0) || 0;
    const expenseTotal = car.expenseEntries?.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0) || 0;
    const totalInvestment = partnerInvTotal + fuelTotal + expenseTotal + (Number(car.purchasePrice) || 0);
    const totalProfit = (car.saleDetails?.salePrice || 0) - totalInvestment;

    return car.partnerInvestments?.map((inv) => {
      const percentage = partnerInvTotal > 0 ? (Number(inv.amount) / partnerInvTotal) * 100 : 0;
      const profitShare = (percentage / 100) * totalProfit;
      const finalAmount = Number(inv.amount) + profitShare;
      return { ...inv, percentage, profitShare, finalAmount };
    }) || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!car) return null;

  const partnerProfits = calculatePartnerProfit();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to={car.status === 'draft' ? '/draft-cars' : '/sold-cars'} className="text-slate-600 hover:text-slate-800">
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">{car.carName}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${car.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
            {car.status}
          </span>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={exportExcel}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <FaFileExcel />
            Export Excel
          </button>
          {car.status === 'draft' && (
            <>
              <Link
                to={`/edit-car/${car._id}`}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Edit Car
              </Link>
              <button
                onClick={() => setShowSellModal(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <FaCheckCircle />
                Mark as Sold
              </button>
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Purchase Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Company</p>
                <p className="text-slate-800 font-medium">{car.company}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Model</p>
                <p className="text-slate-800 font-medium">{car.model}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Registration Number</p>
                <p className="text-slate-800 font-medium">{car.registrationNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Purchase Date</p>
                <p className="text-slate-800 font-medium">{new Date(car.purchaseDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Purchase Price</p>
                <p className="text-slate-800 font-medium">₹{Number(car.purchasePrice).toLocaleString()}</p>
              </div>
              {car.purchasedFrom && (
                <div>
                  <p className="text-sm text-slate-500">Purchased From</p>
                  <p className="text-slate-800 font-medium">{car.purchasedFrom}</p>
                </div>
              )}
            </div>
          </div>

          {car.partnerInvestments?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Partner Investments</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Partner Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                      {car.status === 'sold' && (
                        <>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Investment %</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Profit Share</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Final Amount</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {car.status === 'sold'
                      ? partnerProfits.map((inv, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">{inv.partnerName}</td>
                            <td className="px-4 py-2">₹{Number(inv.amount).toLocaleString()}</td>
                            <td className="px-4 py-2">{new Date(inv.date).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{inv.percentage.toFixed(2)}%</td>
                            <td className="px-4 py-2">₹{inv.profitShare.toLocaleString()}</td>
                            <td className="px-4 py-2">₹{inv.finalAmount.toLocaleString()}</td>
                          </tr>
                        ))
                      : car.partnerInvestments.map((inv, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">{inv.partnerName}</td>
                            <td className="px-4 py-2">₹{Number(inv.amount).toLocaleString()}</td>
                            <td className="px-4 py-2">{new Date(inv.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {car.fuelEntries?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Fuel Entries</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Partner Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {car.fuelEntries.map((fuel, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{fuel.partnerName}</td>
                        <td className="px-4 py-2">₹{Number(fuel.amount).toLocaleString()}</td>
                        <td className="px-4 py-2">{new Date(fuel.fuelDate).toLocaleDateString()}</td>
                        <td className="px-4 py-2">{fuel.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {car.expenseEntries?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Expense Entries</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Partner Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {car.expenseEntries.map((exp, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{exp.partnerName}</td>
                        <td className="px-4 py-2">{exp.title}</td>
                        <td className="px-4 py-2">₹{Number(exp.amount).toLocaleString()}</td>
                        <td className="px-4 py-2">{new Date(exp.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2">{exp.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {car.status === 'sold' && car.saleDetails && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Sale Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Sale Date</p>
                  <p className="text-slate-800 font-medium">{new Date(car.saleDetails.saleDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Sale Price</p>
                  <p className="text-slate-800 font-medium">₹{Number(car.saleDetails.salePrice).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Sold To</p>
                  <p className="text-slate-800 font-medium">{car.saleDetails.soldTo}</p>
                </div>
                {car.saleDetails.notes && (
                  <div>
                    <p className="text-sm text-slate-500">Notes</p>
                    <p className="text-slate-800 font-medium">{car.saleDetails.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {showSellModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Sell Car</h2>
              <form
                onSubmit={handleSubmit(sellCar)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sale Date *</label>
                  <input
                    type="date"
                    {...register('saleDate', { required: 'Required' })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sale Price *</label>
                  <input
                    type="number"
                    {...register('salePrice', { required: 'Required' })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sold To *</label>
                  <input
                    {...register('soldTo', { required: 'Required' })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                  <textarea
                    {...register('notes')}
                    rows="3"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Confirm Sale
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSellModal(false)}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCar;
