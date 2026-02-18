const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const testRoutes = require('./routes/testRoutes');
const marksRoutes = require('./routes/marksRoutes');
const examRoutes = require("./routes/examRoutes");
const subjectRoutes = require('./routes/subjectRoutes');
const performanceRoutes = require('./routes/performanceRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/marks', marksRoutes);
app.use("/api/exams", examRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/performance', performanceRoutes);

module.exports = app;
