import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { carAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useForm, useFieldArray } from 'react-hook-form';
import { FaPlus, FaTrash } from 'react-icons/fa';

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm();

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

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await carAPI.getCarById(id);
        if (res.data.status === 'sold') {
          toast.error('Cannot edit sold car');
          navigate('/sold-cars');
          return;
        }
        const car = res.data;
        reset({
          ...car,
          purchaseDate: car.purchaseDate ? new Date(car.purchaseDate).toISOString().split('T')[0] : '',
          partnerInvestments: (car.partnerInvestments || []).map(inv => ({
            ...inv,
            date: inv.date ? new Date(inv.date).toISOString().split('T')[0] : ''
          })),
          fuelEntries: (car.fuelEntries || []).map(fuel => ({
            ...fuel,
            fuelDate: fuel.fuelDate ? new Date(fuel.fuelDate).toISOString().split('T')[0] : ''
          })),
          expenseEntries: (car.expenseEntries || []).map(exp => ({
            ...exp,
            date: exp.date ? new Date(exp.date).toISOString().split('T')[0] : ''
          }))
        });
      } catch (err) {
        toast.error('Failed to load car');
        navigate('/draft-cars');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await carAPI.updateCar(id, data);
      toast.success('Car updated successfully!');
      navigate('/draft-cars');
    } catch (err) {
      toast.error('Failed to update car');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Edit Car</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Purchase Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Car Name *</label>
                <input
                  {...register('carName', { required: 'Car name is required' })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {errors.carName && <p className="text-red-500 text-sm">{errors.carName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
                <input
                  {...register('company', { required: 'Company is required' })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Model *</label>
                <input
                  {...register('model', { required: 'Model is required' })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {errors.model && <p className="text-red-500 text-sm">{errors.model.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number *</label>
                <input
                  {...register('registrationNumber', { required: 'Registration number is required' })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {errors.registrationNumber && <p className="text-red-500 text-sm">{errors.registrationNumber.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chassis Number</label>
                <input
                  {...register('chassisNumber')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Engine Number</label>
                <input
                  {...register('engineNumber')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                <input
                  {...register('color')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Date *</label>
                <input
                  type="date"
                  {...register('purchaseDate', { required: 'Purchase date is required' })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {errors.purchaseDate && <p className="text-red-500 text-sm">{errors.purchaseDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price *</label>
                <input
                  type="number"
                  {...register('purchasePrice', { required: 'Purchase price is required' })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {errors.purchasePrice && <p className="text-red-500 text-sm">{errors.purchasePrice.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purchased From</label>
                <input
                  {...register('purchasedFrom')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  {...register('purchaseNotes')}
                  rows="3"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Partner Investments</h2>
              <button
                type="button"
                onClick={() => appendInvestment({ partnerName: '', amount: '', date: new Date().toISOString().split('T')[0] })}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaPlus />
                Add Partner
              </button>
            </div>
            <div className="space-y-3">
              {investmentFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Partner Name *</label>
                    <input
                      {...register(`partnerInvestments.${index}.partnerName`, { required: 'Required' })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount *</label>
                    <input
                      type="number"
                      {...register(`partnerInvestments.${index}.amount`, { required: 'Required' })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                    <input
                      type="date"
                      {...register(`partnerInvestments.${index}.date`, { required: 'Required' })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInvestment(index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Fuel Entries</h2>
              <button
                type="button"
                onClick={() => appendFuel({ partnerName: '', amount: '', fuelDate: new Date().toISOString().split('T')[0], notes: '' })}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaPlus />
                Add Fuel Entry
              </button>
            </div>
            <div className="space-y-3">
              {fuelFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Partner Name *</label>
                    <input
                      {...register(`fuelEntries.${index}.partnerName`, { required: 'Required' })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount *</label>
                    <input
                      type="number"
                      {...register(`fuelEntries.${index}.amount`, { required: 'Required' })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                    <input
                      type="date"
                      {...register(`fuelEntries.${index}.fuelDate`, { required: 'Required' })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                    <input
                      {...register(`fuelEntries.${index}.notes`)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFuel(index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Expense Entries</h2>
              <button
                type="button"
                onClick={() => appendExpense({ partnerName: '', title: '', amount: '', date: new Date().toISOString().split('T')[0], notes: '' })}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaPlus />
                Add Expense
              </button>
            </div>
            <div className="space-y-3">
              {expenseFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Partner Name *</label>
                    <input
                      {...register(`expenseEntries.${index}.partnerName`, { required: 'Required' })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                    <input
                      {...register(`expenseEntries.${index}.title`, { required: 'Required' })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount *</label>
                    <input
                      type="number"
                      {...register(`expenseEntries.${index}.amount`, { required: 'Required' })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                    <input
                      type="date"
                      {...register(`expenseEntries.${index}.date`, { required: 'Required' })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                    <input
                      {...register(`expenseEntries.${index}.notes`)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExpense(index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Car'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/draft-cars')}
              className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCar;
