const Car = require('../models/Car');
const XLSX = require('xlsx');
const { jsPDF } = require('jspdf');

const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user._id });
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDraftCars = async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user._id, status: 'draft' });
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSoldCars = async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user._id, status: 'sold' });
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCar = async (req, res) => {
  try {
    const carData = {
      ...req.body,
      owner: req.user._id,
    };

    const car = await Car.create(carData);
    res.status(201).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (car.status === 'sold') {
      return res.status(400).json({ message: 'Cannot edit sold car' });
    }

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await car.deleteOne();
    res.json({ message: 'Car removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const sellCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    car.status = 'sold';
    car.saleDetails = req.body;

    const updatedCar = await car.save();
    res.json(updatedCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const exportCarExcel = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const data = [
      ['Car Sale & Purchase Report'],
      [],
      ['Car Details'],
      ['Car Name', car.carName],
      ['Company', car.company],
      ['Model', car.model],
      ['Registration Number', car.registrationNumber],
      ['Chassis Number', car.chassisNumber || ''],
      ['Engine Number', car.engineNumber || ''],
      ['Color', car.color || ''],
      ['Purchase Date', car.purchaseDate],
      ['Purchase Price', car.purchasePrice],
      ['Purchased From', car.purchasedFrom || ''],
      ['Notes', car.purchaseNotes || ''],
      [],
      ['Partner Investments'],
      ['Partner Name', 'Amount', 'Date'],
      ...car.partnerInvestments.map(inv => [inv.partnerName, inv.amount, inv.date]),
      [],
      ['Fuel Entries'],
      ['Partner Name', 'Amount', 'Date', 'Notes'],
      ...car.fuelEntries.map(fuel => [fuel.partnerName, fuel.amount, fuel.fuelDate, fuel.notes || '']),
      [],
      ['Expense Entries'],
      ['Partner Name', 'Title', 'Amount', 'Date', 'Notes'],
      ...car.expenseEntries.map(exp => [exp.partnerName, exp.title, exp.amount, exp.date, exp.notes || '']),
      [],
      ['Sale Details'],
      car.status === 'sold' ? [
        ['Sale Date', car.saleDetails.saleDate],
        ['Sale Price', car.saleDetails.salePrice],
        ['Sold To', car.saleDetails.soldTo],
        ['Notes', car.saleDetails.notes || ''],
      ] : [['Status', 'Draft']],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Car Report');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename="car-${car.registrationNumber}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user._id });
    const draftCars = cars.filter(car => car.status === 'draft');
    const soldCars = cars.filter(car => car.status === 'sold');

    let totalInvestment = 0;
    let totalExpenses = 0;
    let totalProfit = 0;

    cars.forEach(car => {
      const partnerInvTotal = (car.partnerInvestments || []).reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
      const fuelTotal = (car.fuelEntries || []).reduce((sum, fuel) => sum + (Number(fuel.amount) || 0), 0);
      const expenseTotal = (car.expenseEntries || []).reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
      const carTotalInvestment = partnerInvTotal + fuelTotal + expenseTotal;
      totalInvestment += carTotalInvestment;
      totalExpenses += expenseTotal;

      if (car.status === 'sold' && car.saleDetails?.salePrice) {
        totalProfit += (Number(car.saleDetails.salePrice) || 0) - carTotalInvestment;
      }
    });

    res.json({
      totalCars: cars.length,
      draftCars: draftCars.length,
      soldCars: soldCars.length,
      totalInvestment,
      totalExpenses,
      totalProfit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCars,
  getDraftCars,
  getSoldCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  sellCar,
  exportCarExcel,
  getDashboardStats,
};
