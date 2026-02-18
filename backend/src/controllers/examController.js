const pool = require("../config/db");

const getAllExams = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM exams ORDER BY exam_date");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch exams" });
  }
};
module.exports = { getAllExams };
