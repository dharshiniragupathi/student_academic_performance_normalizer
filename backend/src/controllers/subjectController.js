const pool = require('../config/db');

// Get all subjects
const getAllSubjects = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM subjects ORDER BY id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch subjects' });
  }
};

// Create a subject
const createSubjects = async (req, res) => {
  const { subject_name, max_marks } = req.body;

  // Validation
  if (!subject_name || !max_marks) {
    return res.status(400).json({
      message: 'subject_name and max_marks are required'
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO subjects (subject_name, max_marks)
       VALUES ($1, $2)
       RETURNING *`,
      [subject_name, max_marks]
    );

    res.status(201).json({
      message: 'Subject created successfully',
      subject: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create subject' });
  }
};

module.exports = {
  getAllSubjects,
  createSubjects,
};
