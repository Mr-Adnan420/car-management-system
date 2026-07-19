import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { carAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaFileExcel,
  FaEdit,
  FaCar,
  FaCoins,
  FaGasPump,
} from 'react-icons/fa';
import { Panel, SectionTitle, LoadingState } from '../components/ui';
import DealSummary from '../components/DealSummary';

const ViewCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSellModal, setShowSellModal] = useState(false);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await carAPI.getCarById(id);
        setCar(res.data);
      } catch {
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
      document.body.removeChild(link);
    } catch {
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
    } catch {
      toast.error('Failed to sell car');
    }
  };

  if (loading) return <LoadingState label="Loading car details..." />;
  if (!car) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={car.status === 'draft' ? '/draft-cars' : '/sold-cars'}
            className="btn btn-ghost btn-icon"
          >
            <FaArrowLeft size={14} />
          </Link>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                {car.carName}
              </h1>
              <span
                className={`badge ${car.status === 'draft' ? 'badge-warning' : 'badge-success'}`}
              >
                {car.status}
              </span>
            </div>
            <p className="text-xs sm:text-sm mt-0.5 text-[var(--text-muted)]">
              {car.company} · Model {car.model}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={exportExcel} className="btn btn-success text-xs">
            <FaFileExcel size={12} />
            Export Excel
          </button>

          {car.status === 'draft' && (
            <>
              <Link to={`/edit-car/${car._id}`} className="btn btn-secondary text-xs">
                <FaEdit size={12} />
                Edit Car
              </Link>
              <button
                type="button"
                onClick={() => setShowSellModal(true)}
                className="btn btn-primary text-xs"
              >
                <FaCheckCircle size={12} />
                Mark as Sold
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Panel>
            <SectionTitle icon={FaCar} className="mb-4">Purchase Details</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
              {[
                ['Company', car.company],
                ['Model', car.model],
                ['Registration', car.registrationNumber],
                ['Purchase Date', new Date(car.purchaseDate).toLocaleDateString()],
                ['Purchase Price', `Rs ${Number(car.purchasePrice).toLocaleString()}`],
                car.purchasedFrom && ['Purchased From', car.purchasedFrom],
                car.chassisNumber && ['Chassis Number', car.chassisNumber],
                car.engineNumber && ['Engine Number', car.engineNumber],
                car.color && ['Color', car.color],
              ]
                .filter(Boolean)
                .map(([label, value]) => (
                  <div key={label}>
                    <span className="field-label">{label}</span>
                    <p className="font-display font-bold text-sm sm:text-base">{value}</p>
                  </div>
                ))}
              {car.purchaseNotes && (
                <div className="col-span-2 sm:col-span-3 border-t border-[var(--border)] pt-3 mt-1">
                  <span className="field-label">Notes</span>
                  <p className="text-sm text-[var(--text-muted)]">{car.purchaseNotes}</p>
                </div>
              )}
            </div>
          </Panel>

          {car.partnerInvestments?.length > 0 && (
            <Panel className="p-0 overflow-hidden">
              <div className="p-5 sm:p-6 pb-0">
                <SectionTitle icon={FaCoins} className="mb-4">Partner Investments</SectionTitle>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Partner Name</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {car.partnerInvestments.map((inv, index) => (
                      <tr key={index}>
                        <td className="font-semibold">{inv.partnerName}</td>
                        <td>Rs {Number(inv.amount).toLocaleString()}</td>
                        <td className="text-[var(--text-muted)]">
                          {new Date(inv.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}
        </div>

        <div className="space-y-5">
          {car.status === 'sold' && car.saleDetails && (
            <Panel className="border-[var(--success)]/25 bg-[var(--success-soft)]">
              <SectionTitle icon={FaCheckCircle} className="mb-4">Sale Details</SectionTitle>
              <div className="space-y-3.5">
                <div>
                  <span className="field-label">Sale Date</span>
                  <p className="font-display font-bold">
                    {new Date(car.saleDetails.saleDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="field-label">Sale Price</span>
                  <p className="font-display text-xl sm:text-2xl font-extrabold text-[var(--success)]">
                    Rs {Number(car.saleDetails.salePrice).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="field-label">Sold To</span>
                  <p className="font-display font-bold">{car.saleDetails.soldTo}</p>
                </div>
                {car.saleDetails.notes && (
                  <div className="border-t border-[var(--border)] pt-2">
                    <span className="field-label">Sale Notes</span>
                    <p className="text-xs text-[var(--text-muted)]">{car.saleDetails.notes}</p>
                  </div>
                )}
              </div>
            </Panel>
          )}

          {car.fuelEntries?.length > 0 && (
            <Panel>
              <SectionTitle icon={FaGasPump} className="mb-4">Fuel Logs</SectionTitle>
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {car.fuelEntries.map((fuel, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl border border-[var(--border)] text-xs flex justify-between gap-3"
                  >
                    <div>
                      <p className="font-bold">{fuel.partnerName}</p>
                      <p className="text-[10px] text-[var(--text-soft)] mt-0.5">
                        {new Date(fuel.fuelDate).toLocaleDateString()}
                      </p>
                      {fuel.notes && (
                        <p className="text-[10px] text-[var(--text-muted)] mt-1 italic">
                          {fuel.notes}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-sm shrink-0">
                      Rs {Number(fuel.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {car.expenseEntries?.length > 0 && (
            <Panel>
              <SectionTitle icon={FaCoins} className="mb-4">Expense Logs</SectionTitle>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {car.expenseEntries.map((exp, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl border border-[var(--border)] text-xs flex justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold">{exp.title}</span>
                        <span className="badge badge-accent !text-[9px] !py-0.5">{exp.partnerName}</span>
                      </div>
                      <p className="text-[10px] text-[var(--text-soft)] mt-0.5">
                        {new Date(exp.date).toLocaleDateString()}
                      </p>
                      {exp.notes && (
                        <p className="text-[10px] text-[var(--text-muted)] mt-1 italic">
                          {exp.notes}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-sm shrink-0">
                      Rs {Number(exp.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>

      <DealSummary
        partnerInvestments={car.partnerInvestments}
        fuelEntries={car.fuelEntries}
        expenseEntries={car.expenseEntries}
        purchasePrice={car.purchasePrice}
        salePrice={car.saleDetails?.salePrice}
      />

      {showSellModal && (
        <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md panel p-6 animate-fade-up">
            <h2 className="font-display text-xl font-bold mb-4">Confirm Sale Details</h2>
            <form onSubmit={handleSubmit(sellCar)} className="space-y-4">
              <div>
                <label className="field-label">Sale Date *</label>
                <input
                  type="date"
                  {...register('saleDate', { required: 'Required' })}
                  className="field"
                />
              </div>
              <div>
                <label className="field-label">Sale Price (Rs) *</label>
                <input
                  type="number"
                  {...register('salePrice', { required: 'Required' })}
                  className="field"
                  placeholder="e.g. 5200000"
                />
              </div>
              <div>
                <label className="field-label">Sold To *</label>
                <input
                  {...register('soldTo', { required: 'Required' })}
                  className="field"
                  placeholder="Buyer's name / Dealership"
                />
              </div>
              <div>
                <label className="field-label">Notes</label>
                <textarea
                  {...register('notes')}
                  rows="3"
                  className="field"
                  placeholder="Payment terms, commission notes..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn btn-success flex-1 py-3">
                  Confirm Sale
                </button>
                <button
                  type="button"
                  onClick={() => setShowSellModal(false)}
                  className="btn btn-secondary flex-1 py-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCar;
