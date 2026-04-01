const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const testRoutes = require('./routes/testRoutes');
const marksRoutes = require('./routes/marksRoutes');
const examRoutes = require("./routes/examRoutes");
const subjectRoutes = require('./routes/subjectRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const staffRoutes = require('./routes/staffRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const allowedOrigin = process.env.FRONTEND_URL;

app.use(cors({
  origin: allowedOrigin || true,
  credentials: true,
}));
app.use(express.json());
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  next();
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/marks', marksRoutes);
app.use("/api/exams", examRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/reports', reportRoutes);

module.exports = app;
