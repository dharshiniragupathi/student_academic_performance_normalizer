const pool = require('../config/db');

const getMyPerformance = async (req, res) => {
  try {
    const studentUserId = req.user.id; // from JWT

    const result = await pool.query(
      `
      SELECT 
        e.exam_name,
        sub.subject_name,
        m.marks_obtained,
        m.normalized_score
      FROM marks m
      JOIN subjects sub ON m.subject_id = sub.id
      JOIN exams e ON m.exam_id = e.id
      JOIN students s ON m.student_id = s.id
      WHERE s.user_id = $1
      `,
      [studentUserId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getMyPerformance };
