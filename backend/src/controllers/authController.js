const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // TEMP: since passwords are plain text in DB
    // Later you can hash them
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.role === 'student' && !email.endsWith('@avp.ac.in')) {
      return res.status(403).json({
        message: 'Students must login using @avp.ac.in domain'
      });
    }
    if (user.role === 'staff' && !email.endsWith('@avp.bitsathy.ac.in')) {
      return res.status(403).json({
        message: 'Staff must login using @avp.bitsathy.ac.in domain'
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = { login };
