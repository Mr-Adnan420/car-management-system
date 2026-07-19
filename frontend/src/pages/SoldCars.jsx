import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { carAPI } from '../services/api';
import { toast } from 'react-toastify';
import { PageHeader, LoadingState, EmptyState } from '../components/ui';
import { FaEye, FaFileExcel, FaCheckCircle, FaCar } from 'react-icons/fa';

const SoldCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const res = await carAPI.getSoldCars();
      setCars(res.data);
    } catch {
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
      document.body.removeChild(link);
    } catch {
      toast.error('Failed to export');
    }
  };

  const calculateProfit = (car) => {
    const fuelTotal = (car.fuelEntries || []).reduce(
      (sum, fuel) => sum + (Number(fuel.amount) || 0),
      0
    );
    const expenseTotal = (car.expenseEntries || []).reduce(
      (sum, exp) => sum + (Number(exp.amount) || 0),
      0
    );
    const totalCost = (Number(car.purchasePrice) || 0) + fuelTotal + expenseTotal;
    return (Number(car.saleDetails?.salePrice) || 0) - totalCost;
  };

  return (
    <div>
      <PageHeader
        title="Sold Cars"
        subtitle="Closed deals and realized profit or loss."
      />

      {loading ? (
        <LoadingState label="Loading inventory..." />
      ) : cars.length === 0 ? (
        <EmptyState
          icon={FaCheckCircle}
          title="No sold cars yet"
          description="Mark a draft car as sold to see it appear in this history."
          action={
            <Link to="/draft-cars" className="btn btn-success">
              <FaCar size={12} />
              View Draft Cars
            </Link>
          }
        />
      ) : (
        <div className="panel overflow-hidden animate-fade-up p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Car Details</th>
                  <th>Purchase Price</th>
                  <th>Sale Price</th>
                  <th>Profit / Loss</th>
                  <th>Sale Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => {
                  const profit = calculateProfit(car);
                  return (
                    <tr key={car._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center shrink-0">
                            <FaCar size={14} />
                          </div>
                          <div>
                            <p className="font-display font-bold text-sm sm:text-base">{car.carName}</p>
                            <p className="text-xs text-[var(--text-muted)]">
                              {car.company} · {car.model}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm font-semibold whitespace-nowrap">
                        Rs {Number(car.purchasePrice).toLocaleString()}
                      </td>
                      <td className="text-sm font-semibold whitespace-nowrap">
                        Rs {Number(car.saleDetails?.salePrice).toLocaleString()}
                      </td>
                      <td>
                        <span className={`badge ${profit >= 0 ? 'badge-success' : 'badge-danger'}`}>
                          {profit >= 0 ? '+' : ''}Rs {profit.toLocaleString()}
                        </span>
                      </td>
                      <td className="text-sm text-[var(--text-muted)] whitespace-nowrap">
                        {new Date(car.saleDetails?.saleDate).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1.5">
                          <Link to={`/car/${car._id}`} className="btn btn-ghost btn-icon" title="View">
                            <FaEye size={13} className="text-[var(--accent)]" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => exportExcel(car._id, car.registrationNumber)}
                            className="btn btn-ghost btn-icon"
                            title="Export Excel"
                          >
                            <FaFileExcel size={13} className="text-[var(--success)]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoldCars;
