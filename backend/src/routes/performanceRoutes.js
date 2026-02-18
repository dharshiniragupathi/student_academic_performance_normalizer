const express = require('express');
const router = express.Router();

const { getStudentPerformance } = require('../controllers/performanceController');
const { verifyToken } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

// Student can view ONLY their performance
router.get(
  '/student/:studentId',
  verifyToken,
  authorizeRoles('student'),
  getStudentPerformance
);

module.exports = router;
