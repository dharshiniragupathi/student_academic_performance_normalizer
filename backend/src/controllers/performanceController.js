const pool = require('../config/db');

const getStudentPerformance = async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await pool.query(
      `SELECT
          e.exam_name,
          sub.subject_name,
          m.marks_obtained,
          sub.max_marks AS subject_max_marks,
          e.max_marks AS exam_max_marks,
          m.normalized_score
       FROM marks m
       JOIN students s ON m.student_id = s.id
       JOIN subjects sub ON m.subject_id = sub.id
       JOIN exams e ON m.exam_id = e.id
       WHERE s.id = $1
       ORDER BY e.id, sub.id`,
      [studentId]
    );

    res.json({
      student_id: studentId,
      performance: result.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch performance data' });
  }
};

module.exports = {
  getStudentPerformance
};
