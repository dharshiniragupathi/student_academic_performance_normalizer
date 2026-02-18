const express = require('express');
const router = express.Router();
const { getAllExams } = require('../controllers/examController');

router.get('/', getAllExams);

module.exports = router;
