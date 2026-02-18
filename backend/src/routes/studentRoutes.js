const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const { getMyPerformance } = require('../controllers/studentController');

// Only STUDENT can access this
router.get(
  '/performance',
  verifyToken,
  authorizeRoles('student'),
  getMyPerformance
);

module.exports = router;
