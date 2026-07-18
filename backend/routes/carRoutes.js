const express = require('express');
const {
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
} = require('../controllers/carController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getCars).post(protect, createCar);
router.get('/dashboard', protect, getDashboardStats);
router.get('/draft-cars', protect, getDraftCars);
router.get('/sold-cars', protect, getSoldCars);
router.get('/export-excel/:id', protect, exportCarExcel);
router.route('/:id').get(protect, getCarById).put(protect, updateCar).delete(protect, deleteCar);
router.put('/:id/sell', protect, sellCar);

module.exports = router;
