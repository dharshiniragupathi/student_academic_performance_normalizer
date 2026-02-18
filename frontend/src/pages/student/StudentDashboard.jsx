import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiAlertTriangle,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiDownload,
  FiHelpCircle,
  FiMessageSquare,
  FiMinus,
  FiPhone,
  FiSend,
  FiTarget,
  FiTrendingDown,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import "./StudentDashboard.css";

const studentInfo = {
  name: "Priya Sharma",
  degree: "MBBS Year 3",
  rollNo: "2023MBBS145",
  normalizedScore: 75.4,
  highest: 88.7,
  totalSubjects: 9,
  improvement: "0.0%",
};

const exams = [
  "Mid Semester Exam 1 - Jan 2026",
  "End Semester Exam 1 - Jan 2026",
  "Mid Semester Exam 2 - Mar 2026",
  "End Semester Exam 2 - Apr 2026",
];

const subjects = [
  { name: "Anatomy", normalized: 82.5, raw: "68/80", classAvg: 65.2, classHighest: 91.4, percentile: 78, trend: "up" },
  { name: "Physiology", normalized: 79.3, raw: "72/100", classAvg: 68.5, classHighest: 90.2, percentile: 72, trend: "up" },
  { name: "Biochemistry", normalized: 67.8, raw: "58/75", classAvg: 51.8, classHighest: 86.1, percentile: 68, trend: "flat" },
  { name: "Pathology", normalized: 88.7, raw: "82/100", classAvg: 72.3, classHighest: 95.3, percentile: 85, trend: "up" },
  { name: "Pharmacology", normalized: 62.5, raw: "54/80", classAvg: 58.2, classHighest: 88.9, percentile: 55, trend: "down" },
  { name: "Microbiology", normalized: 75.2, raw: "61/75", classAvg: 56.9, classHighest: 89.7, percentile: 74, trend: "up" },
  { name: "General Medicine", normalized: 84.6, raw: "78/100", classAvg: 70.5, classHighest: 94.1, percentile: 82, trend: "up" },
  { name: "General Surgery", normalized: 72.3, raw: "64/90", classAvg: 62.8, classHighest: 90.8, percentile: 70, trend: "flat" },
  { name: "OBG", normalized: 65.8, raw: "52/75", classAvg: 54.2, classHighest: 87.6, percentile: 62, trend: "down" },
];

const classNormalizedScores = [
  { studentName: "Aarav Mehta", normalizedScore: 94.8 },
  { studentName: "Neha Reddy", normalizedScore: 93.6 },
  { studentName: "Karan Iyer", normalizedScore: 92.1 },
  { studentName: "Ishita Singh", normalizedScore: 90.9 },
  { studentName: "Rohan Patel", normalizedScore: 89.7 },
  { studentName: "Ananya Verma", normalizedScore: 88.4 },
  { studentName: "Vikram Nair", normalizedScore: 87.8 },
  { studentName: "Meera Joshi", normalizedScore: 86.9 },
];

const trendData = [
  { exam: "Mid Sem 2", score: 82.5 },
  { exam: "End Sem 2", score: 84.0 },
  { exam: "Mid Sem 1", score: 84.2 },
  { exam: "End Sem 1", score: 85.6 },
];

const queriesSeed = [
  {
    id: 1,
    subject: "Pharmacology",
    status: "answered",
    to: "Dr. Emily Davis",
    date: "Feb 10, 2026",
    question: "Could you please clarify the mechanism of action for beta blockers?",
    response:
      "Beta blockers work by blocking the effects of epinephrine on beta-adrenergic receptors. This reduces heart rate, blood pressure, and cardiac output. Please review Chapter 12 for detailed mechanisms.",
  },
  {
    id: 2,
    subject: "OBG",
    status: "pending",
    to: "Dr. Jennifer Lee",
    date: "Feb 12, 2026",
    question: "Can you suggest a focused revision plan for labor management topics?",
    response: "",
  },
];

const mentorSessions = [
  { id: 1, title: "Session 8 - Academic Planning", date: "Feb 6, 2026", status: "Completed" },
  { id: 2, title: "Session 9 - Weak Area Review", date: "Feb 20, 2026", status: "Upcoming" },
];

const getTrendMeta = (trend, score) => {
  if (trend === "up") return { icon: <FiTrendingUp />, iconClass: "trend-up", scoreClass: "score-blue" };
  if (trend === "down")
    return { icon: <FiTrendingDown />, iconClass: "trend-down", scoreClass: "score-amber" };
  if (score >= 75) return { icon: <FiMinus />, iconClass: "trend-flat", scoreClass: "score-blue" };
  return { icon: <FiMinus />, iconClass: "trend-flat", scoreClass: "score-amber" };
};

function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedExam, setSelectedExam] = useState(exams[0]);
  const [queryType, setQueryType] = useState("");
  const [queryText, setQueryText] = useState("");
  const [formError, setFormError] = useState("");
  const [queries, setQueries] = useState(queriesSeed);

  const chartData = useMemo(
    () =>
      subjects.map((item) => ({
        subject:
          item.name === "General Medicine"
            ? "General Me..."
            : item.name === "General Surgery"
              ? "General Su..."
              : item.name.length > 11
                ? `${item.name.slice(0, 9)}...`
                : item.name,
        yourScore: Number(item.normalized.toFixed(1)),
        highestInClass: Number(item.classHighest.toFixed(1)),
      })),
    []
  );
  const topClassNormalizedScores = useMemo(
    () =>
      [...classNormalizedScores]
        .sort((a, b) => b.normalizedScore - a.normalizedScore)
        .slice(0, 6)
        .map((item, index) => ({
          rank: index + 1,
          name: item.studentName,
          score: Number(item.normalizedScore.toFixed(1)),
        })),
    []
  );

  const submitQuery = (event) => {
    event.preventDefault();
    const cleanText = queryText.trim();
    if (!queryType || !cleanText) {
      if (!queryType) {
        setFormError("Please select query type.");
      } else {
        setFormError("Please enter your query.");
      }
      return;
    }

    setQueries((prev) => [
      {
        id: Date.now(),
        type: queryType,
        subject: queryType === "marks" ? "Marks Query" : "Academic Query",
        status: "pending",
        to: "Faculty Team",
        date: "Today",
        question: cleanText,
        response: "",
      },
      ...prev,
    ]);
    setFormError("");
    setQueryType("");
    setQueryText("");
    setActiveTab("queries");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  return (
    <div className="student-dashboard-shell">
      <div className="student-container">
        <header className="student-title-row">
          <div className="title-wrap">
            <div className="title-icon">
              <FiBookOpen />
            </div>
            <div>
              <h1>Academic Performance Normalizer</h1>
              <p>
                <FiUser /> {studentInfo.name} • {studentInfo.degree} • Roll No: {studentInfo.rollNo}
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button className="download-btn" type="button" onClick={() => window.alert("Report downloaded")}>
              <FiDownload /> Download Report
            </button>
            <button className="download-btn" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <section className="exam-panel">
          <div className="exam-left">
            <label htmlFor="exam-select">Select Exam:</label>
            <div className="exam-select-wrap">
              <select
                id="exam-select"
                value={selectedExam}
                onChange={(event) => setSelectedExam(event.target.value)}
              >
                {exams.map((exam) => (
                  <option key={exam} value={exam}>
                    {exam}
                  </option>
                ))}
              </select>
              <FiChevronDown />
            </div>
          </div>
          <div className="exam-right">
            <span className="term-pill">Spring 2026</span>
            <span className="term-date">Jan 2026</span>
          </div>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-head">
              <h3>Normalized Score</h3>
              <span className="stat-badge blue-badge">
                <FiTarget />
              </span>
            </div>
            <p className="stat-value blue-value">{studentInfo.normalizedScore}</p>
          </article>
          <article className="stat-card">
            <div className="stat-head">
              <h3>Total Subjects</h3>
              <span className="stat-badge purple-badge">
                <FiBookOpen />
              </span>
            </div>
            <p className="stat-value purple-value">{studentInfo.totalSubjects}</p>
          </article>
          <article className="stat-card">
            <div className="stat-head">
              <h3>Highest Score</h3>
              <span className="stat-badge green-badge">
                <FiCheckCircle />
              </span>
            </div>
            <p className="stat-value green-value">{studentInfo.highest}</p>
          </article>
          <article className="stat-card">
            <div className="stat-head">
              <h3>Improvement</h3>
              <span className="stat-badge green-badge">
                <FiTrendingUp />
              </span>
            </div>
            <p className="stat-value green-value">{studentInfo.improvement}</p>
          </article>
        </section>

        <section className="tab-strip">
          {["overview", "subjects", "analysis", "queries", "mentor"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? "tab-btn active" : "tab-btn"}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </section>

        {activeTab === "overview" && (
          <section className="tab-content">
            <div className="chart-grid">
              <article className="panel-card">
                <h2>Top 6 Normalized Scores in Class</h2>
                <div className="top-score-list">
                  {topClassNormalizedScores.map((item) => (
                    <div key={item.name} className="top-score-row">
                      <span className="rank-badge">{item.rank}</span>
                      <span className="top-score-subject">{item.name}</span>
                      <strong className="top-score-value">{item.score}</strong>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel-card">
                <h2>Performance Trend</h2>
                <ResponsiveContainer width="100%" height={360}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#cbced5" />
                    <XAxis dataKey="exam" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Average Normalized Score"
                      stroke="#3f7bda"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#ffffff", stroke: "#3f7bda", strokeWidth: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </article>
            </div>

            <article className="panel-card">
              <h2>Insights & Recommendations</h2>
              <div className="insight-stack">
                <div className="insight-row success">
                  <FiCheckCircle />
                  <span>Excellent performance in 1 subject(s): Pathology</span>
                </div>
                <div className="insight-row danger">
                  <FiAlertTriangle />
                  <span>Need improvement in: Biochemistry, Pharmacology, OBG. Consider additional practice.</span>
                </div>
                <div className="insight-row info">
                  <FiHelpCircle />
                  <span>You're performing above class average in 9 out of 9 subjects.</span>
                </div>
              </div>
            </article>
          </section>
        )}

        {activeTab === "subjects" && (
          <section className="tab-content">
            <div className="subject-grid">
              {subjects.map((subject) => {
                const trendMeta = getTrendMeta(subject.trend, subject.normalized);
                return (
                  <article key={subject.name} className="subject-card">
                    <div className="subject-head">
                      <h3>{subject.name}</h3>
                      <span className={trendMeta.iconClass}>{trendMeta.icon}</span>
                    </div>

                    <div className="subject-score-row">
                      <span>Normalized Score</span>
                      <strong className={trendMeta.scoreClass}>{subject.normalized}</strong>
                    </div>

                    <div className="subject-progress">
                      <div className="subject-progress-fill" style={{ width: `${subject.normalized}%` }} />
                    </div>

                    <div className="subject-meta">
                      <div>
                        <p>Raw Score</p>
                        <strong>{subject.raw}</strong>
                      </div>
                      <div>
                        <p>Class Avg</p>
                        <strong>{subject.classAvg}</strong>
                      </div>
                    </div>

                    <div className="subject-percentile">
                      <p>Percentile Rank</p>
                      <strong>{subject.percentile}th percentile</strong>
                    </div>
                  </article>
                );
              })}
            </div>

            <article className="panel-card">
              <h2>Performance Comparison</h2>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#cbced5" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="yourScore" name="Your Score" fill="#3f7bda" />
                  <Bar dataKey="highestInClass" name="Highest in Class" fill="#8a99ad" />
                </BarChart>
              </ResponsiveContainer>
            </article>
          </section>
        )}

        {activeTab === "analysis" && (
          <section className="tab-content">
            <article className="panel-card urgent-card">
              <p>
                <FiAlertTriangle /> <strong>Urgent Attention Required:</strong>
              </p>
              <span>1 subject(s) need immediate focus - Pharmacology</span>
            </article>

            <article className="panel-card">
              <h2 className="icon-title">
                <FiTarget /> Subject-wise Weakness Analysis
              </h2>

              <div className="analysis-card critical">
                <div className="analysis-head">
                  <h3>Pharmacology</h3>
                  <span className="status-chip critical-chip">
                    <FiAlertTriangle /> Critical
                  </span>
                </div>
                <div className="analysis-grid">
                  <div>
                    <p>Current Score</p>
                    <strong className="danger-text">62.5%</strong>
                    <p className="mt">Percentile Rank</p>
                    <strong>55th</strong>
                  </div>
                  <div>
                    <p>Gap to Target (85%)</p>
                    <strong>22.5%</strong>
                    <p className="mt">Progress to Target</p>
                    <div className="target-progress">
                      <div style={{ width: "72%" }} />
                    </div>
                  </div>
                </div>
                <div className="action-panel">
                  <h4>Recommended Actions:</h4>
                  <ul>
                    <li>Create drug classification charts</li>
                    <li>Focus on mechanism of action and side effects</li>
                    <li>Practice clinical prescription writing</li>
                    <li>Schedule a mentoring session to discuss improvement strategies</li>
                  </ul>
                </div>
              </div>

              <div className="analysis-card warning">
                <div className="analysis-head">
                  <h3>OBG</h3>
                  <span className="status-chip warning-chip">
                    <FiTrendingDown /> Needs Improvement
                  </span>
                </div>
                <div className="analysis-grid">
                  <div>
                    <p>Current Score</p>
                    <strong className="amber-text">65.8%</strong>
                    <p className="mt">Percentile Rank</p>
                    <strong>62th</strong>
                  </div>
                  <div>
                    <p>Gap to Target (85%)</p>
                    <strong>19.2%</strong>
                    <p className="mt">Progress to Target</p>
                    <div className="target-progress">
                      <div style={{ width: "78%" }} />
                    </div>
                  </div>
                </div>
                <div className="action-panel">
                  <h4>Recommended Actions:</h4>
                  <ul>
                    <li>Attend more labor ward sessions</li>
                    <li>Practice obstetric examination techniques</li>
                    <li>Review normal and abnormal labor management</li>
                    <li>Schedule a mentoring session to discuss improvement strategies</li>
                  </ul>
                </div>
              </div>
            </article>

            <article className="panel-card">
              <h2 className="icon-title">
                <FiBookOpen /> General Study Recommendations
              </h2>
              <div className="general-tip blue-tip">
                <FiHelpCircle />
                <div>
                  <h4>Time Management:</h4>
                  <p>Allocate more study time to subjects with lower scores. Aim for 2-3 hours daily for critical subjects.</p>
                </div>
              </div>
              <div className="general-tip violet-tip">
                <FiHelpCircle />
                <div>
                  <h4>Active Learning:</h4>
                  <p>Don't just read - practice solving questions, create summaries, and teach concepts to peers for better retention.</p>
                </div>
              </div>
              <div className="general-tip green-tip">
                <FiHelpCircle />
                <div>
                  <h4>Faculty Consultation:</h4>
                  <p>Don't hesitate to raise queries through the Query Section. Regular interaction with faculty helps clarify doubts early.</p>
                </div>
              </div>
              <div className="general-tip amber-tip">
                <FiHelpCircle />
                <div>
                  <h4>Practice Questions:</h4>
                  <p>Solve at least 50 MCQs per subject weekly. Focus on previous year papers and standard question banks.</p>
                </div>
              </div>
            </article>
          </section>
        )}

        {activeTab === "queries" && (
          <section className="tab-content">
            <article className="panel-card">
              <h2 className="icon-title">
                <FiMessageSquare /> Ask Your Faculty
              </h2>
              <p className="subline">Raise your doubts and queries directly to the respective subject faculty</p>
              <form className="query-form" onSubmit={submitQuery}>
                <label htmlFor="query-type">Query Type</label>
                <div className="query-select-wrap">
                  <select
                    id="query-type"
                    value={queryType}
                    onChange={(event) => setQueryType(event.target.value)}
                  >
                    <option value="">Choose query type</option>
                    <option value="academic">Academic</option>
                    <option value="marks">Marks</option>
                  </select>
                  <FiChevronDown />
                </div>
                <label htmlFor="query-text">Your Query</label>
                <textarea
                  id="query-text"
                  placeholder={
                    queryType === "marks"
                      ? "Type your marks-related query here..."
                      : "Type your academic query here..."
                  }
                  value={queryText}
                  onChange={(event) => setQueryText(event.target.value)}
                />
                {formError && <p className="form-error">{formError}</p>}
                <button type="submit" className="submit-query">
                  <FiSend /> Submit Query
                </button>
              </form>
            </article>

            <article className="panel-card">
              <h2>Your Queries</h2>
              <p className="subline">Track your submitted questions and responses</p>
              <div className="queries-list">
                {queries.map((query) => (
                  <div className="query-entry" key={query.id}>
                    <div className="query-head">
                      <h3>{query.subject}</h3>
                      <div className="query-tags">
                        <span className="status query-type-tag">
                          {(query.type || "academic").charAt(0).toUpperCase() + (query.type || "academic").slice(1)}
                        </span>
                        <span className={query.status === "answered" ? "status answered" : "status pending"}>
                          {query.status === "answered" ? <FiCheckCircle /> : <FiCalendar />}
                          {query.status === "answered" ? "Answered" : "Pending"}
                        </span>
                      </div>
                    </div>
                    <p className="query-meta">
                      To: {query.to} - {query.date}
                    </p>
                    <div className="question-block">
                      <h4>Your Question:</h4>
                      <p>{query.question}</p>
                    </div>
                    {query.status === "answered" && (
                      <div className="response-block">
                        <h4>Faculty Response:</h4>
                        <p>{query.response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeTab === "mentor" && (
          <section className="tab-content">
            <article className="panel-card mentor-card">
              <div className="mentor-top">
                <div className="mentor-avatar">
                  <FiUser />
                </div>
                <div>
                  <h2>Dr. Rajesh Kumar</h2>
                  <p>Professor of Medicine</p>
                  <span className="mentor-dept">Internal Medicine</span>
                </div>
              </div>
              <button className="contact-btn" type="button">
                <FiMessageSquare /> Contact
              </button>

              <div className="mentor-contact-grid">
                <p>
                  <FiMessageSquare /> rajesh.kumar@medcollege.edu
                </p>
                <p>
                  <FiPhone /> +1 (555) 123-4567
                </p>
              </div>

              <div className="mentor-stats">
                <div>
                  <p>
                    <FiCalendar /> Next Meeting
                  </p>
                  <strong>Feb 20, 2026 at 2:00 PM</strong>
                </div>
                <div>
                  <p>
                    <FiMessageSquare /> Total Sessions
                  </p>
                  <strong>8</strong>
                </div>
              </div>
            </article>

            <article className="panel-card">
              <h2>Mentoring Sessions</h2>
              <div className="session-list">
                {mentorSessions.map((session) => (
                  <div className="session-row" key={session.id}>
                    <div>
                      <h3>{session.title}</h3>
                      <p>{session.date}</p>
                    </div>
                    <span className={session.status === "Completed" ? "session-status done" : "session-status upcoming"}>
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
