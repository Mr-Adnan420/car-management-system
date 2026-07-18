const mongoose = require('mongoose');

const partnerInvestmentSchema = new mongoose.Schema({
  partnerName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

const fuelEntrySchema = new mongoose.Schema({
  partnerName: { type: String, required: true },
  amount: { type: Number, required: true },
  fuelDate: { type: Date, required: true },
  notes: { type: String },
});

const expenseEntrySchema = new mongoose.Schema({
  partnerName: { type: String, required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
});

const saleDetailsSchema = new mongoose.Schema({
  saleDate: { type: Date },
  salePrice: { type: Number },
  soldTo: { type: String },
  notes: { type: String },
});

const carSchema = new mongoose.Schema({
  carName: { type: String, required: true },
  company: { type: String, required: true },
  model: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  chassisNumber: { type: String },
  engineNumber: { type: String },
  color: { type: String },
  purchaseDate: { type: Date, required: true },
  purchasePrice: { type: Number, required: true },
  purchasedFrom: { type: String },
  purchaseNotes: { type: String },
  partnerInvestments: [partnerInvestmentSchema],
  fuelEntries: [fuelEntrySchema],
  expenseEntries: [expenseEntrySchema],
  saleDetails: saleDetailsSchema,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'sold'],
    default: 'draft',
  },
}, {
  timestamps: true,
});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
