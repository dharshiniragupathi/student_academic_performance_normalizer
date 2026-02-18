const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

// Only logged-in users
router.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: 'You are authenticated',
    user: req.user
  });
});

// Only admin
router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

module.exports = router;
