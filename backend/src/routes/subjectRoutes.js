const express = require('express');
const router = express.Router();
const { getAllSubjects, createSubjects } = require('../controllers/subjectController');

router.get('/', getAllSubjects);
router.post('/', createSubjects);

module.exports = router;
