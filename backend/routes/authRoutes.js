const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
