import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { carAPI } from '../services/api';
import { toast } from 'react-toastify';
import { PageHeader, LoadingState, EmptyState } from '../components/ui';
import { FaEye, FaEdit, FaTrash, FaFileExcel, FaPlus, FaCar } from 'react-icons/fa';

const DraftCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const res = await carAPI.getDraftCars();
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

  const deleteCar = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    try {
      await carAPI.deleteCar(id);
      toast.success('Car deleted');
      fetchCars();
    } catch {
      toast.error('Failed to delete car');
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
      document.body.removeChild(link);
    } catch {
      toast.error('Failed to export');
    }
  };

  const calculateTotals = (car) => {
    const fuelTotal = (car.fuelEntries || []).reduce(
      (sum, fuel) => sum + (Number(fuel.amount) || 0),
      0
    );
    const expenseTotal = (car.expenseEntries || []).reduce(
      (sum, exp) => sum + (Number(exp.amount) || 0),
      0
    );
    const totalExpenses = fuelTotal + expenseTotal;
    // Total Cost = Purchase + Expenses (ledger formula)
    const currentCost = (Number(car.purchasePrice) || 0) + totalExpenses;
    const partnerInv = (car.partnerInvestments || []).reduce(
      (sum, inv) => sum + (Number(inv.amount) || 0),
      0
    );
    return { totalInvestment: partnerInv, expenseTotal: totalExpenses, currentCost };
  };

  return (
    <div>
      <PageHeader
        title="Draft Cars"
        subtitle="Manage unsold inventory and running costs."
        actions={
          <Link to="/add-car" className="btn btn-primary">
            <FaPlus size={12} />
            Add New Car
          </Link>
        }
      />

      {loading ? (
        <LoadingState label="Loading inventory..." />
      ) : cars.length === 0 ? (
        <EmptyState
          icon={FaCar}
          title="No draft cars yet"
          description="Add your first car to start tracking purchase price, partners, and expenses."
          action={
            <Link to="/add-car" className="btn btn-primary">
              <FaPlus size={12} />
              Add Car
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
                  <th>Registration</th>
                  <th>Purchase Price</th>
                  <th>Investment</th>
                  <th>Expenses</th>
                  <th>Total Cost</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => {
                  const { totalInvestment, expenseTotal, currentCost } = calculateTotals(car);
                  return (
                    <tr key={car._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0">
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
                      <td>
                        <span className="badge badge-accent">{car.registrationNumber}</span>
                      </td>
                      <td className="text-sm font-semibold whitespace-nowrap">
                        Rs {Number(car.purchasePrice).toLocaleString()}
                      </td>
                      <td className="text-sm text-[var(--text-muted)] whitespace-nowrap">
                        Rs {totalInvestment.toLocaleString()}
                      </td>
                      <td className="text-sm text-[var(--text-muted)] whitespace-nowrap">
                        Rs {expenseTotal.toLocaleString()}
                      </td>
                      <td className="text-sm font-bold whitespace-nowrap">
                        Rs {currentCost.toLocaleString()}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1.5">
                          <Link to={`/car/${car._id}`} className="btn btn-ghost btn-icon" title="View">
                            <FaEye size={13} className="text-[var(--accent)]" />
                          </Link>
                          <Link to={`/edit-car/${car._id}`} className="btn btn-ghost btn-icon" title="Edit">
                            <FaEdit size={13} className="text-[var(--warning)]" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteCar(car._id)}
                            className="btn btn-ghost btn-icon"
                            title="Delete"
                          >
                            <FaTrash size={13} className="text-[var(--danger)]" />
                          </button>
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

export default DraftCars;
