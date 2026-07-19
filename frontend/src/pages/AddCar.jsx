import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  FaPlus,
  FaTrash,
  FaCar,
  FaUsers,
  FaGasPump,
  FaReceipt,
  FaHandshake,
} from 'react-icons/fa';
import { PageHeader, Panel, SectionTitle, FieldError } from '../components/ui';
import DealSummary from '../components/DealSummary';
import {
  buildDealSummary,
  hasSaleData,
  formatRs,
  formatRsSigned,
  formatPercent,
  sumAmounts,
} from '../utils/calculations';

const AddCar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      partnerInvestments: [],
      fuelEntries: [],
      expenseEntries: [],
      saleDetails: {
        saleDate: '',
        salePrice: '',
        soldTo: '',
        notes: '',
      },
    },
  });

  const {
    fields: investmentFields,
    append: appendInvestment,
    remove: removeInvestment,
  } = useFieldArray({ control, name: 'partnerInvestments' });

  const {
    fields: fuelFields,
    append: appendFuel,
    remove: removeFuel,
  } = useFieldArray({ control, name: 'fuelEntries' });

  const {
    fields: expenseFields,
    append: appendExpense,
    remove: removeExpense,
  } = useFieldArray({ control, name: 'expenseEntries' });

  const watched = watch();
  const deal = buildDealSummary({
    partnerInvestments: watched.partnerInvestments,
    fuelEntries: watched.fuelEntries,
    expenseEntries: watched.expenseEntries,
    purchasePrice: watched.purchasePrice,
    salePrice: watched.saleDetails?.salePrice,
  });
  const willSell = hasSaleData(watched.saleDetails);
  const totalPartnerInv = sumAmounts(watched.partnerInvestments);
  const today = new Date().toISOString().split('T')[0];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const sold = hasSaleData(data.saleDetails);
      const payload = {
        ...data,
        saleDetails: sold
          ? {
              saleDate: data.saleDetails.saleDate || undefined,
              salePrice: Number(data.saleDetails.salePrice),
              soldTo: data.saleDetails.soldTo || '',
              notes: data.saleDetails.notes || '',
            }
          : undefined,
        status: sold ? 'sold' : 'draft',
      };
      await carAPI.createCar(payload);
      toast.success(sold ? 'Car saved to Sold' : 'Car saved as Draft');
      navigate(sold ? '/sold-cars' : '/draft-cars');
    } catch {
      toast.error('Failed to add car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Add New Car"
        subtitle="Partners get Share % & profit Amount live — sale price decides Draft vs Sold."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-fade-up">
        <Panel>
          <SectionTitle icon={FaCar} className="mb-4">
            Purchase Information
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Car Name *</label>
              <input
                {...register('carName', { required: 'Car name is required' })}
                className="field"
                placeholder="e.g. Civic Oriel"
              />
              <FieldError message={errors.carName?.message} />
            </div>
            <div>
              <label className="field-label">Company *</label>
              <input
                {...register('company', { required: 'Company is required' })}
                className="field"
                placeholder="e.g. Honda"
              />
              <FieldError message={errors.company?.message} />
            </div>
            <div>
              <label className="field-label">Model *</label>
              <input
                {...register('model', { required: 'Model is required' })}
                className="field"
                placeholder="e.g. 2022"
              />
              <FieldError message={errors.model?.message} />
            </div>
            <div>
              <label className="field-label">Registration Number *</label>
              <input
                {...register('registrationNumber', { required: 'Registration number is required' })}
                className="field"
                placeholder="e.g. LE-12-3456"
              />
              <FieldError message={errors.registrationNumber?.message} />
            </div>
            <div>
              <label className="field-label">Chassis Number</label>
              <input {...register('chassisNumber')} className="field" />
            </div>
            <div>
              <label className="field-label">Engine Number</label>
              <input {...register('engineNumber')} className="field" />
            </div>
            <div>
              <label className="field-label">Color</label>
              <input {...register('color')} className="field" />
            </div>
            <div>
              <label className="field-label">Purchase Date *</label>
              <input
                type="date"
                {...register('purchaseDate', { required: 'Purchase date is required' })}
                className="field"
              />
              <FieldError message={errors.purchaseDate?.message} />
            </div>
            <div>
              <label className="field-label">Purchase Price (Rs) *</label>
              <input
                type="number"
                {...register('purchasePrice', { required: 'Purchase price is required' })}
                className="field"
                placeholder="e.g. 4500000"
              />
              <FieldError message={errors.purchasePrice?.message} />
            </div>
            <div>
              <label className="field-label">Purchased From</label>
              <input {...register('purchasedFrom')} className="field" />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Notes</label>
              <textarea {...register('purchaseNotes')} rows="3" className="field" />
            </div>
          </div>
        </Panel>

        {/* Partners — like Car Dealer Ledger */}
        <Panel>
          <div className="flex items-center justify-between gap-4 mb-4">
            <SectionTitle icon={FaUsers}>Partners</SectionTitle>
            <button
              type="button"
              onClick={() => appendInvestment({ partnerName: '', amount: '', date: today })}
              className="btn btn-primary text-xs py-2 px-3"
            >
              <FaPlus size={10} />
              Add Partner
            </button>
          </div>

          {investmentFields.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] italic mb-3">
              No partners yet. Add partners to split profit by investment share.
            </p>
          ) : (
            <div className="space-y-3 mb-4">
              {investmentFields.map((field, index) => {
                const amount = Number(watched.partnerInvestments?.[index]?.amount) || 0;
                const share =
                  totalPartnerInv > 0 ? (amount / totalPartnerInv) * 100 : 0;
                const partnerAmount =
                  deal.hasSale && deal.totals.netProfit !== null
                    ? (share / 100) * deal.totals.netProfit
                    : null;

                return (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end p-4 rounded-xl border border-dashed border-[var(--border-strong)]"
                  >
                    <div className="lg:col-span-2">
                      <label className="field-label">Name *</label>
                      <input
                        {...register(`partnerInvestments.${index}.partnerName`, {
                          required: 'Required',
                        })}
                        className="field"
                        placeholder="Partner name"
                      />
                    </div>
                    <div>
                      <label className="field-label">Investment (Rs) *</label>
                      <input
                        type="number"
                        {...register(`partnerInvestments.${index}.amount`, {
                          required: 'Required',
                        })}
                        className="field"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="field-label">Share %</label>
                      <div className="field flex items-center font-bold text-[var(--accent)] bg-[var(--accent-soft)] border-[var(--accent)]/20">
                        {formatPercent(share)}
                      </div>
                    </div>
                    <div>
                      <label className="field-label">Amount (Profit)</label>
                      <div
                        className={`field flex items-center font-bold ${
                          partnerAmount == null
                            ? 'text-[var(--text-soft)]'
                            : partnerAmount >= 0
                              ? 'text-[var(--success)]'
                              : 'text-[var(--danger)]'
                        }`}
                      >
                        {deal.hasSale ? formatRsSigned(partnerAmount) : '—'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input type="hidden" {...register(`partnerInvestments.${index}.date`)} />
                      <button
                        type="button"
                        onClick={() => removeInvestment(index)}
                        className="btn btn-danger flex-1"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl bg-[var(--accent-soft)] px-4 py-3 border border-[var(--accent)]/20">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Total Partner Investment
            </span>
            <span className="font-display font-bold text-[var(--accent)]">
              {formatRs(totalPartnerInv)}
            </span>
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between gap-4 mb-4">
            <SectionTitle icon={FaGasPump}>Fuel Entries</SectionTitle>
            <button
              type="button"
              onClick={() =>
                appendFuel({ partnerName: '', amount: '', fuelDate: today, notes: '' })
              }
              className="btn btn-primary text-xs py-2 px-3"
            >
              <FaPlus size={10} />
              Add Fuel
            </button>
          </div>
          <div className="space-y-3">
            {fuelFields.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] italic">No fuel entries.</p>
            ) : (
              fuelFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end p-4 rounded-xl border border-dashed border-[var(--border-strong)]"
                >
                  <div>
                    <label className="field-label">Partner *</label>
                    <input
                      {...register(`fuelEntries.${index}.partnerName`, { required: 'Required' })}
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="field-label">Amount *</label>
                    <input
                      type="number"
                      {...register(`fuelEntries.${index}.amount`, { required: 'Required' })}
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="field-label">Date *</label>
                    <input
                      type="date"
                      {...register(`fuelEntries.${index}.fuelDate`, { required: 'Required' })}
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="field-label">Notes</label>
                    <input {...register(`fuelEntries.${index}.notes`)} className="field" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFuel(index)}
                    className="btn btn-danger"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between gap-4 mb-4">
            <SectionTitle icon={FaReceipt}>Expenses</SectionTitle>
            <button
              type="button"
              onClick={() =>
                appendExpense({
                  partnerName: '',
                  title: '',
                  amount: '',
                  date: today,
                  notes: '',
                })
              }
              className="btn btn-primary text-xs py-2 px-3"
            >
              <FaPlus size={10} />
              Add Expense
            </button>
          </div>
          <div className="space-y-3 mb-4">
            {expenseFields.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] italic">No expenses yet.</p>
            ) : (
              expenseFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end p-4 rounded-xl border border-dashed border-[var(--border-strong)]"
                >
                  <div>
                    <label className="field-label">Partner *</label>
                    <input
                      {...register(`expenseEntries.${index}.partnerName`, { required: 'Required' })}
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="field-label">Title *</label>
                    <input
                      {...register(`expenseEntries.${index}.title`, { required: 'Required' })}
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="field-label">Amount *</label>
                    <input
                      type="number"
                      {...register(`expenseEntries.${index}.amount`, { required: 'Required' })}
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="field-label">Date *</label>
                    <input
                      type="date"
                      {...register(`expenseEntries.${index}.date`, { required: 'Required' })}
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="field-label">Notes</label>
                    <input {...register(`expenseEntries.${index}.notes`)} className="field" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExpense(index)}
                    className="btn btn-danger"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[var(--warning-soft)] px-4 py-3 border border-[var(--warning)]/20">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Total Expenses (Fuel + Other)
            </span>
            <span className="font-display font-bold text-[var(--warning)]">
              {formatRs(deal.totals.totalExpenses)}
            </span>
          </div>
        </Panel>

        <Panel>
          <SectionTitle icon={FaHandshake} className="mb-2">
            Sale Details
          </SectionTitle>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            {willSell
              ? 'Sale price filled → this record will go to Sold Cars.'
              : 'Leave sale price empty → this record will stay in Draft Cars.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Sale Date</label>
              <input type="date" {...register('saleDetails.saleDate')} className="field" />
            </div>
            <div>
              <label className="field-label">Sale Price (Rs)</label>
              <input
                type="number"
                {...register('saleDetails.salePrice')}
                className="field"
                placeholder="Leave empty for draft"
              />
            </div>
            <div>
              <label className="field-label">Sold To</label>
              <input {...register('saleDetails.soldTo')} className="field" />
            </div>
            <div>
              <label className="field-label">Sale Notes</label>
              <input {...register('saleDetails.notes')} className="field" />
            </div>
          </div>
        </Panel>

        <DealSummary
          partnerInvestments={watched.partnerInvestments}
          fuelEntries={watched.fuelEntries}
          expenseEntries={watched.expenseEntries}
          purchasePrice={watched.purchasePrice}
          salePrice={watched.saleDetails?.salePrice}
        />

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={loading} className="btn btn-primary px-8 py-3.5">
            {loading ? 'Saving...' : willSell ? 'Save to Sold Cars' : 'Save as Draft'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/draft-cars')}
            className="btn btn-secondary px-8 py-3.5"
          >
            Cancel
          </button>
          <span
            className={`badge ${willSell ? 'badge-success' : 'badge-warning'} ml-auto`}
          >
            {willSell ? 'Will save as Sold' : 'Will save as Draft'}
          </span>
        </div>
      </form>
    </div>
  );
};

export default AddCar;
