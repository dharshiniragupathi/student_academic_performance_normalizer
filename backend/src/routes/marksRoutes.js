const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const { addMarks } = require('../controllers/marksController');

// Only STAFF can add marks
router.post(
  '/add',
  verifyToken,
  authorizeRoles('staff'),
  addMarks
);

module.exports = router;
